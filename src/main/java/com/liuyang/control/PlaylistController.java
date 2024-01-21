package com.liuyang.control;

import com.google.gson.Gson;
import com.liuyang.mapper.PlaylistMapper;
import com.liuyang.mapper.SongMapper;
import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.Playlist;
import com.liuyang.pojo.Song;
import com.liuyang.pojo.User;
import com.liuyang.servlet.PlaylistServlet;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.session.SqlSession;

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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@WebServlet("/playlist/*")
@MultipartConfig
public class PlaylistController extends PlaylistServlet {
    /**
     *
     *
     */
    String uriReplace="/Ly/playlist/";

    @Override
    public String getUriReplace() {
        return this.uriReplace;
    }

    public void selectPlaylist(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //根据歌单风格来得到歌单数据
        String style = req.getParameter("style");
        System.out.println("执行selectPlaylist方法");
        System.out.println(style);
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        List<Playlist> playlists = mapper.selectStyle(style);
        Map<String,Object> data=new HashMap<>();
        data.put("playlists",playlists);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }

    public void selectAll(HttpServletRequest req,HttpServletResponse resp) throws IOException {
        //全部的歌单
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        List<Playlist> playlists = mapper.selectALL();
        Map<String,Object> data=new HashMap<>();
        data.put("playlists",playlists);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }

    public void selectPlaylist_id(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String id = req.getParameter("id");
        System.out.println(id);
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        mapper.addCnt(Integer.parseInt(id));
        List<String> styles = mapper.selectLabel(Integer.parseInt(id));//查找风格
        Playlist playlist = mapper.selectByID(Integer.parseInt(id));//查找歌单
        System.out.println(playlist);
        Map<String,Object> data=new HashMap<>();
        data.put("playlist",playlist);//歌单数据
        data.put("styles",styles);//歌单风格
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void selectHot(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        // 初始化用户-物品评分矩阵
        // 用户-物品评分矩阵
        Map<Integer, List<Integer>> userItemMatrix = new HashMap<>();
        // 每个用户收藏的歌单

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        PlaylistMapper playlistMapper = sqlSession.getMapper(PlaylistMapper.class);
        //得到所有的用户
        List<User> users = mapper.selectALL();
        for (User user : users) {
            userItemMatrix.put(user.getId(), new ArrayList<Integer>());
            String mailbox = user.getMailbox();
            List<Playlist> playlists = playlistMapper.selectCollectionPlaylist(mailbox);//得到该用户收藏的歌单
            for (Playlist playlist : playlists) {
                userItemMatrix.get(user.getId()).add(playlist.getId());
            }
        }

        Map<Integer,Integer> playlistCnt = new HashMap<>();

        List<Playlist> playlists1 = playlistMapper.selectALL();
        for (Playlist playlist : playlists1) {
            int cnt = playlistMapper.selectPlayCnt(playlist.getId());
            playlistCnt.put(playlist.getId(),cnt);
        }
        // 初始化共现矩阵的哈希表
        Map<Integer, Map<Integer, Integer>> cooccurrenceMatrix = new HashMap<>();
        // 构建共现矩阵
        for (Map.Entry<Integer, List<Integer>> entry : userItemMatrix.entrySet()) {
            List<Integer> itemList = entry.getValue();
            for (int i = 0; i < itemList.size(); i++) {
                for (int j = i+1; j < itemList.size(); j++) {
                    cooccurrenceMatrix.computeIfAbsent(itemList.get(i), k -> new HashMap<>()).merge(itemList.get(j), 1, Integer::sum);
                    cooccurrenceMatrix.computeIfAbsent(itemList.get(j), k -> new HashMap<>()).merge(itemList.get(i), 1, Integer::sum);
                }
            }
        }
        // 打印共现矩阵
        Map<Integer, Map<Integer, Double>> playlistSimilarity = new HashMap<>();
        for (int item1 : cooccurrenceMatrix.keySet()) {
            Map<Integer, Integer> item1Map = cooccurrenceMatrix.get(item1);
            Map<Integer, Double> integerDoubleMap = new HashMap<>();
            for (int item2 : item1Map.keySet()) {
                int count = item1Map.get(item2);
                double result = Math.sqrt((double) (playlistCnt.get(item1) * playlistCnt.get(item2)));
                double cnt = 1.0*count/result;
                integerDoubleMap.put(item2,cnt);
            }
            playlistSimilarity.put(item1,integerDoubleMap);
        }
        for (int item1 : playlistSimilarity.keySet()) {
            Map<Integer, Double> item1Map = playlistSimilarity.get(item1);
            for (int item2 : item1Map.keySet()) {
                Double count = item1Map.get(item2);
                System.out.println("(" + item1 + ", " + item2 + "): " + count);
            }
        }
        List<Playlist> playlists = new ArrayList<>();
        List<Integer> myPlaylistIds = userItemMatrix.get(id);
        for (Integer myPlaylistId : myPlaylistIds) {
            Map<Integer, Double> map = playlistSimilarity.get(myPlaylistId);
            // 假设已经向map中添加了键值对

            // 将Map的键值对转换为List
            List<Map.Entry<Integer, Double>> entryList = new ArrayList<>(map.entrySet());

            // 对List进行排序
            Collections.sort(entryList, new Comparator<Map.Entry<Integer, Double>>() {
                @Override
                public int compare(Map.Entry<Integer, Double> entry1, Map.Entry<Integer, Double> entry2) {
                    // 降序排序
                    return entry2.getValue().compareTo(entry1.getValue());
                }
            });

            // 输出排序后的结果
            System.out.println(myPlaylistId);
            System.out.println("Sorted Map:");
            for (int i = 0; i < Math.min(6, entryList.size()); i++) {
                int flag=1;
                Map.Entry<Integer, Double> entry = entryList.get(i);
                Playlist playlist = playlistMapper.selectByID(entry.getKey());
                System.out.println(entry.getKey() + ": " + entry.getValue());
                for (Playlist playlist1 : playlists) {
                    if(playlist1.getId()==playlist.getId()){
                        flag=0;
                    }
                }
                if (flag==1){
                    playlists.add(playlist);
                }
            }
        }

        Map<String,Object> data=new HashMap<>();
        data.put("playlists",playlists);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }

    public void selectPersonality(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //个性化推荐的歌单
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        List<Playlist> playlists = mapper.selectPersonality();
        Map<String,Object> data=new HashMap<>();
        data.put("playlists",playlists);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }
    public void selectByAuthor(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //根据作者来查找歌单
        String author = req.getParameter("author");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        List<Playlist> playlists = mapper.selectByAuthor(author);
        Map<String,Object> data=new HashMap<>();
        data.put("playlists",playlists);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }
    public void changeImg(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String saveDirectory = "D:\\IDEA liu_da_shuai\\music\\src\\main\\webapp\\img\\playlist";  // 指定保存文件的目录

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

    public void createPlayliet(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        //创建歌单
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");

        String img = req.getParameter("img");
        String name = req.getParameter("name");
        String author = req.getParameter("author");
        String description = req.getParameter("description");
        // 获取当前的日期和时间
        LocalDateTime now = LocalDateTime.now();
        // 定义时间格式
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // 将日期和时间格式化为指定的格式
        String time = now.format(formatter);
        // 输出格式化后的时间字符串

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        Playlist playlist =new Playlist();
        playlist.setAuthor(author);
        playlist.setDescription(description);
        playlist.setImg(img);
        playlist.setName(name);
        playlist.setCnt(0);
        playlist.setTime(time);

        mapper.createPlaylist(playlist);
        Playlist playlist1 = mapper.selectNewPlaylist();

        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
        Map<String,Object> data=new HashMap<>();
        data.put("playlist",playlist1);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
    }

    public  void revisePlayliet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //编辑歌单
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");

        String img = req.getParameter("img");
        String name = req.getParameter("name");
        String author = req.getParameter("author");
        String description = req.getParameter("description");
        String id = req.getParameter("id");

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        mapper.revisePlayliet(Integer.parseInt(id),name,img,description);
        Playlist playlist = mapper.selectByID(Integer.parseInt(id));
        Map<String,Object> data=new HashMap<>();
        data.put("playlist",playlist);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);

        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void deletePlaylist(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //删除歌单
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String id = req.getParameter("id");

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        mapper.deletePlaylist(Integer.parseInt(id));
        mapper.deletePlaylistStyle(Integer.parseInt(id));
        mapper.deletePlaylistSong(Integer.parseInt(id));
        Map<String,Object> data=new HashMap<>();
        data.put("flag",1);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void delete_likeSong(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //从我喜欢中删除
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String mailbox = req.getParameter("mailbox");
        String songId = req.getParameter("songId");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        /*从我喜欢中删除*/
        mapper.delete_likeSong(mailbox, Integer.parseInt(songId));
        Map<String,Object> data=new HashMap<>();
        data.put("songId",songId);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void delete_playlistSong(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //从指定歌单中删除歌曲
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String listId = req.getParameter("listId");
        String songId = req.getParameter("songId");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        /*从指定歌单中删除歌曲*/
        mapper.delete_playlistSong(Integer.parseInt(listId), Integer.parseInt(songId));
        Map<String,Object> data=new HashMap<>();
        data.put("songId",songId);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void deletePlaylistStyle(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        /*
        * 删除歌单的风格
        * */
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String listId = req.getParameter("id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        mapper.deletePlaylistStyle(Integer.parseInt(listId));
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void createStyle(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");

        String listId = req.getParameter("id");
        String style = req.getParameter("style");
        System.out.println(style);
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        /*新添加选择的风格*/
        mapper.createStyle(Integer.parseInt(listId),style);
        Map<String,Object> data=new HashMap<>();
        data.put("flag",1);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void addSong_to_playlist(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");

        String list_id = req.getParameter("list_id");
        String song_id = req.getParameter("song_id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        int flag = mapper.selectBySong(Integer.parseInt(list_id), Integer.parseInt(song_id));

        Map<String,Object> data=new HashMap<>();
        if(flag==0){
            //说明没有，可以添加
            mapper.addSong_to_playlist(Integer.parseInt(list_id), Integer.parseInt(song_id));
            data.put("flag",1);//1表示添加成功
        }else {
            //说明有，添加不了
            data.put("flag",0);//0表示添加失败
        }
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void addSong_to_like(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");

        String mailbox = req.getParameter("mailbox");
        String song_id = req.getParameter("song_id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        int flag = mapper.selectBySongLike(mailbox, Integer.parseInt(song_id));
        Map<String,Object> data=new HashMap<>();
        if(flag==0){
            //说明没有，可以添加
            mapper.addSong_to_like(mailbox, Integer.parseInt(song_id));
            data.put("flag",1);//1表示添加成功
        }else {
            //说明有，添加不了
            data.put("flag",0);//0表示添加失败
        }
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void CollectionPlaylist(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        Map<String,Object> data=new HashMap<>();

        String mailbox = req.getParameter("mailbox");
        String list_id = req.getParameter("list_id");
        String flag = req.getParameter("flag");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        int cnt=0;
        if("1".equals(flag)){
            mapper.addCollectionPlaylist(mailbox, Integer.parseInt(list_id));
            cnt=1;//添加成功
        }else if("-1".equals(flag)){
            mapper.deleteCollectionPlaylist(mailbox, Integer.parseInt(list_id));
            cnt=-1;//删除成功
        }
        data.put("flag",cnt);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void selectCollectionPlaylist(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        Map<String,Object> data=new HashMap<>();

        String mailbox = req.getParameter("mailbox");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        List<Playlist> playlists = mapper.selectCollectionPlaylist(mailbox);
        Gson gson=new Gson();
        data.put("playlists",playlists);
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
}

















