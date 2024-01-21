package com.liuyang.control;

import com.google.gson.Gson;
import com.liuyang.mapper.PlaylistMapper;
import com.liuyang.mapper.SongMapper;
import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.Playlist;
import com.liuyang.pojo.Singer;
import com.liuyang.pojo.Song;
import com.liuyang.pojo.User;
import com.liuyang.pojo.vo.JedisConnectionFactory;
import com.liuyang.servlet.PlaylistServlet;
import com.liuyang.servlet.SongServlet;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.session.SqlSession;
import redis.clients.jedis.Jedis;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author 23852
 */
@WebServlet("/song/*")
@MultipartConfig
public class SongController extends SongServlet {
    /**
     * url标识，需要替换到这个字符串
     * 替换掉后的字符串，就是真正要执行的方法
     */
    String uriReplace = "/Ly/song/";

    @Override
    public String getUriReplace() {
        return this.uriReplace;
    }

    public void select_Playlist(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String id = req.getParameter("id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        List<Song> songs = mapper.selectByPlaylist(Integer.parseInt(id));
        Map<String,Object> data=new HashMap<>();
        data.put("songs",songs);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }
    public void selectSongsByAuthor(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String author = req.getParameter("author");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        List<Song> songs = mapper.selectSingerSong(author);
        Map<String,Object> data=new HashMap<>();
        data.put("songs",songs);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }

    public void selectLike(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //我喜欢
        String mailbox = req.getParameter("mailbox");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        System.out.println(mailbox);
        List<Song> songs = mapper.selectLike(mailbox);
        Map<String,Object> data=new HashMap<>();
        data.put("songs",songs);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }
    public void rankingTime(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //新歌榜
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        List<Song> songs = mapper.select_rankingTime();
        Map<String,Object> data=new HashMap<>();
        data.put("songs",songs);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }
    public void hotSongRanking(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //新歌榜
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        List<Song> songs = mapper.select_hotRanking();
        Map<String,Object> data=new HashMap<>();
        data.put("songs",songs);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }

    public void selectById(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String id = req.getParameter("id");
        Map<String,Object> data=new HashMap<>();
        Jedis jedis;
        jedis = JedisConnectionFactory.getJedis();
        jedis.auth("1314520qwe");
        jedis.select(0);
        String name="user:"+id;
        String s = jedis.get(name);
        if(s==null){
            SqlSession sqlSession = GetSqlSession.createSqlSession();
            SongMapper mapper = sqlSession.getMapper(SongMapper.class);
            Song song = mapper.selectById(Integer.parseInt(id));
            data.put("song",song);
            jedis.set(name, String.valueOf(song));
            jedis.expire(name, 60);
        }else{
            data.put("song",s);
        }
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }

    public void selectSearchAll(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String text = req.getParameter("text");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper songMapper = sqlSession.getMapper(SongMapper.class);
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        PlaylistMapper playlistMapper = sqlSession.getMapper(PlaylistMapper.class);
        List<Song> songs = songMapper.selectSongName(text);
        List<User> users = userMapper.selectDoText(text);
        List<Playlist> playlists = playlistMapper.selectPlaylistDoText(text);
        Map<String,Object> data=new HashMap<>();//音乐
        data.put("songs",songs);
        data.put("users",users);
        data.put("playlists",playlists);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void changeImg(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String saveDirectory = "D:\\IDEA liu_da_shuai\\music\\src\\main\\webapp\\img\\song";  // 指定保存文件的目录

        // 获取上传的文件
        Part filePart = req.getPart("img");  // 替换为实际的字段名
        String fileName = filePart.getSubmittedFileName();

        try (InputStream fileContent = filePart.getInputStream()) {
            // 构建保存文件的路径
            String savePath = saveDirectory + File.separator + fileName;
            // 将文件保存到指定目录
            Files.copy(fileContent, new File(savePath).toPath(), StandardCopyOption.REPLACE_EXISTING);
            System.out.println("文件保存成功，路径：" + savePath);
            resp.getWriter().write(fileName);

        } catch (IOException e) {
            System.out.println("文件保存失败: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void setMp3(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String saveDirectory = "D:\\IDEA liu_da_shuai\\music\\src\\main\\webapp\\mp3";  // 指定保存文件的目录

        // 获取上传的文件
        Part filePart = req.getPart("mp3");  // 替换为实际的字段名
        String fileName = filePart.getSubmittedFileName();

        try (InputStream fileContent = filePart.getInputStream()) {
            // 构建保存文件的路径
            String savePath = saveDirectory + File.separator + fileName;
            // 将文件保存到指定目录
            Files.copy(fileContent, new File(savePath).toPath(), StandardCopyOption.REPLACE_EXISTING);
            System.out.println("文件保存成功，路径：" + savePath);
            resp.getWriter().write(fileName);

        } catch (IOException e) {
            System.out.println("文件保存失败: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void setLyrics(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String saveDirectory = "D:\\IDEA liu_da_shuai\\music\\src\\main\\webapp\\lyrics";  // 指定保存文件的目录

        // 获取上传的文件
        Part filePart = req.getPart("歌词");  // 替换为实际的字段名
        String fileName = filePart.getSubmittedFileName();

        try (InputStream fileContent = filePart.getInputStream()) {
            // 构建保存文件的路径
            String savePath = saveDirectory + File.separator + fileName;
            // 将文件保存到指定目录
            Files.copy(fileContent, new File(savePath).toPath(), StandardCopyOption.REPLACE_EXISTING);
            System.out.println("文件保存成功，路径：" + savePath);
            resp.getWriter().write(fileName);

        } catch (IOException e) {
            System.out.println("文件保存失败: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void createSong(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        Song song=new Song();
        String img = req.getParameter("img");
        String name = req.getParameter("name");
        String lyrics = req.getParameter("lyrics");
        String mp3 = req.getParameter("mp3");
        String createTime = req.getParameter("createTime");
        String author = req.getParameter("author");
        String time = req.getParameter("time");

        song.setCreateTime(createTime);
        song.setName(name);
        song.setHref("mp3/"+mp3);
        song.setAuthor(author);
        song.setLyrics("lyrics/"+lyrics);
        song.setImg(img);
        song.setTime(time);
        song.setCnt(0);

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        mapper.addSong(song);
        Song song1 = mapper.selectNewSong();


        Map<String,Object> data=new HashMap<>();//音乐
        data.put("song",song1);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void becomeSinger(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        Song song=new Song();
        String img = req.getParameter("img");
        String name = req.getParameter("name");
        String lyrics = req.getParameter("lyrics");
        String mp3 = req.getParameter("mp3");
        String createTime = req.getParameter("createTime");
        String author = req.getParameter("author");
        String time = req.getParameter("time");

        song.setCreateTime(createTime);
        song.setName(name);
        song.setHref("mp3/"+mp3);
        song.setAuthor(author);
        song.setLyrics("lyrics/"+lyrics);
        song.setImg(img);
        song.setTime(time);
        song.setCnt(0);

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        mapper.addSong1(song);
        Song song1 = mapper.selectNewSong();
        mapper.addSinger(author,song1.getId(),createTime);

        Map<String,Object> data=new HashMap<>();//音乐
        data.put("song",song1);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void selectMySong(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String name = req.getParameter("uname");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        System.out.println(name);
        List<Song> mySongs = mapper.selectMySong(name);
        Map<String,Object> data=new HashMap<>();//音乐
        data.put("mySongs",mySongs);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void selectNewSongs(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String cnt = req.getParameter("cnt");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        int number = mapper.selectSongNumber();//歌曲总量
        List<Song> songs = mapper.selectNewSongs(Integer.parseInt(cnt));//歌曲列表
        Map<String,Object> data=new HashMap<>();//音乐
        data.put("number",number);
        data.put("songs",songs);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void selectNewSinger(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String cnt = req.getParameter("cnt");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        int number = mapper.selectSingerNumber();//歌手申请总量


        List<User> users = mapper.selectNewSingerUser(Integer.parseInt(cnt));
        List<Song> songs = mapper.selectNewSinger(Integer.parseInt(cnt));

        Map<String,Object> data=new HashMap<>();//音乐
        data.put("number",number);
        data.put("users",users);
        data.put("songs",songs);

        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void updateSongState_no(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String id = req.getParameter("id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        mapper.updateSongState_no(Integer.parseInt(id));

        Map<String,Object> data=new HashMap<>();//音乐
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void updateSongState_yes(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String id = req.getParameter("id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        mapper.updateSongState_yes(Integer.parseInt(id));
        Map<String,Object> data=new HashMap<>();//音乐
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void singerButton_no(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String id = req.getParameter("id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        mapper.singerButton_no(Integer.parseInt(id));
        mapper.deleteSongById(Integer.parseInt(id));
        Map<String,Object> data=new HashMap<>();//音乐
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void singerButton_yes(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String id = req.getParameter("id");
        String name = req.getParameter("name");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        mapper.singerButton_no(Integer.parseInt(id));
        //删除关系表数据
        mapper.updateUserStatus(name);
        //用户身份改变
        mapper.updateSongState_yes(Integer.parseInt(id));
        // 歌曲发布
        Map<String,Object> data=new HashMap<>();//音乐
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
}

















