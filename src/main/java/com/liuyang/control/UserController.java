package com.liuyang.control;

import com.google.gson.Gson;
import com.liuyang.mapper.PlaylistMapper;
import com.liuyang.mapper.SongMapper;
import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.Community;
import com.liuyang.pojo.Playlist;
import com.liuyang.pojo.Song;
import com.liuyang.pojo.User;
import com.liuyang.pojo.vo.MessageModel;
import com.liuyang.service.UserService;
import com.liuyang.servlet.UserServlet;
import com.liuyang.util.*;
import com.sun.corba.se.impl.oa.poa.AOMEntry;
import org.apache.ibatis.session.SqlSession;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/user/*")
@MultipartConfig
public class UserController extends UserServlet {
    /**
     * url标识，需要替换到这个字符串
     * 替换掉后的字符串，就是真正要执行的方法
     */
    String uriReplace = "/Ly/user/";
    private UserService service = new UserService();

    @Override
    public String getUriReplace() {
        return this.uriReplace;
    }

    public void login(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String mailbox;
        String password;
        if (req.getMethod().equals("GET")) {
            mailbox = req.getParameter("mailbox");
            password = req.getParameter("password");
        } else {
            JSONObject jsonRequest = GetJsonObject.getJsonObject(req);
            mailbox = jsonRequest.getString("mailbox");
            password = jsonRequest.getString("password");
        }

        password = SHA1.computeSHA1(password);
        MessageModel messageModel = service.login(mailbox, password);
        resp.setContentType("text/html;charset=utf-8");

        Gson gson = new Gson();
        Map<String, Object> data = new HashMap<>();
        if (messageModel.getCode() == 1) {
            User user = (User) messageModel.getObject();
            //保存Cookie
            String json1 = gson.toJson(user);

            SqlSession sqlSession = GetSqlSession.createSqlSession();
            PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
            SongMapper songMapper = sqlSession.getMapper(SongMapper.class);
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            List<User> fans = userMapper.selectFans(user.getMailbox());//我的粉丝
            List<User> concerns = userMapper.selectConcern(user.getMailbox());//我的关注
            List<Song> likeSongs = songMapper.selectLike(mailbox);/*我喜欢的音乐*/
            List<Song> mySongs = songMapper.selectMySong(user.getUsername());/*我上传的歌曲*/
            List<Playlist> playlists = mapper.selectByAuthor(user.getUsername());/*我创建的歌单*/
            List<Playlist> collectionPlaylists = mapper.selectCollectionPlaylist(mailbox);/*我收藏的歌单*/
            data.put("flag", 1);
            req.getSession().setAttribute("user", messageModel.getObject());
            //生成token令牌
            String token = JWTUtils.createToken(mailbox);
            String longToken = JWTUtils.createLongToken(mailbox);

            resp.setHeader("token", token);
            resp.setHeader("long_token", longToken);
            data.put("user_data",json1);
            data.put("playlists",playlists);
            data.put("collectionPlaylists",collectionPlaylists);
            data.put("likeSongs",likeSongs);
            data.put("mySongs",mySongs);
            data.put("concerns",concerns);
            data.put("fans",fans);
            String json = gson.toJson(data);
            resp.getWriter().write(json);
            System.out.println("登录成功");
        }else{
            data.put("flag",0);
            data.put("msg",messageModel.getMsg());
            String json = gson.toJson(data);
            resp.getWriter().write(json);
        }
    }

    public void enroll(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        //防止读取中文有问题
        req.setCharacterEncoding("UTF-8");
        String mailbox;
        String password;
        String uname;
        if (req.getMethod().equals("GET")) {
            mailbox = req.getParameter("mailbox");
            uname = req.getParameter("uname");
            password = req.getParameter("password");
        } else {
            JSONObject jsonRequest = GetJsonObject.getJsonObject(req);
            mailbox = jsonRequest.getString("mailbox");
            password = jsonRequest.getString("password");
            uname = jsonRequest.getString("uname");
        }
        password = SHA1.computeSHA1(password);
        //2调用mybatis完成查询
        //2.2 获取SqlSession对象
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        //2.3 获取mapper对象
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        resp.setContentType("text/html;charset=utf-8");
        PrintWriter writer = resp.getWriter();

        //2.4 调用方法
        User us = mapper.findByMailbox(mailbox);
        if (us != null) {
            writer.write("该邮箱已经被注册");
        } else {
            User user = new User();
            user.setUsername(uname);
            user.setMailbox(mailbox);
            user.setPassword(password);
            user.setStatus("USER");
            user.setAvatar("img/logo.png");
            mapper.InsertUser(user);
            writer.write("注册成功");
        }
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
        //防止中文乱码
    }

    public void pdMailbox(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=utf-8");
        JSONObject jsonRequest = GetJsonObject.getJsonObject(req);
        //1.接收邮箱
        String mailbox = jsonRequest.getString("mailbox");

        //2.调用service查询User对象
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        User user = mapper.findByMailbox(mailbox);
        if (user == null) {
            resp.getWriter().write("可用");
        } else {
            resp.getWriter().write("无用");
        }

        sqlSession.close();
    }

    public void pdUname(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=utf-8");
        //1.接收用户名
        String uname = req.getParameter("uname");
        System.out.println(uname);

        //2.调用service查询User对象
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        User user = mapper.findByUname(uname);
        if (user == null) {
            resp.getWriter().write("可用");
        } else {
            resp.getWriter().write("无用");
        }
        //3.响应标记
        sqlSession.close();
    }
    public void sendCaptcha(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/html;charset=utf-8");
        JSONObject jsonRequest = GetJsonObject.getJsonObject(req);
        //1.接收邮箱
        String mailbox = jsonRequest.getString("mailbox");
        //2.发送邮箱
        try {
            Email.email(mailbox,resp);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void changeImg(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String saveDirectory = "D:\\IDEA liu_da_shuai\\music\\src\\main\\webapp\\img\\avatar";  // 指定保存文件的目录
        System.out.println(111222333);

        // 获取上传的文件
        Part filePart = req.getPart("avatar");  // 替换为实际的字段名
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

    public void changeMsg(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String oldName = req.getParameter("oldName");
        String newName = req.getParameter("newName");
        String signature = req.getParameter("signature");
        String avatar = req.getParameter("avatar");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        mapper.changeMsg(newName,signature,avatar,oldName);
        mapper.changeUname(newName,oldName);
        mapper.changeSongAuthor(newName,oldName);

        resp.getWriter().write("修改成功");


        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void selectAllData(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String name = req.getParameter("uname");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        PlaylistMapper playlistMapper = sqlSession.getMapper(PlaylistMapper.class);
        SongMapper songMapper = sqlSession.getMapper(SongMapper.class);
        User user = userMapper.findByUname(name);/*用户资料*/
        List<User> concerns = userMapper.selectConcern(user.getMailbox());//用户的关注列表
        List<User> fans = userMapper.selectFans(user.getMailbox());//用户的粉丝
        List<Song> songs = songMapper.selectLike(user.getMailbox());/*用户喜欢的歌曲列表*/
        List<Song> mySongs = songMapper.selectSingerSong(user.getUsername());/*用户自己的歌*/
        List<Playlist> playlists = playlistMapper.selectByAuthor(name);/*用户创建的歌单*/
        List<Playlist> collectionPlaylists = playlistMapper.selectCollectionPlaylist(user.getMailbox());/*用户收藏的歌单*/

        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        data.put("user",user);
        data.put("playlists",playlists);
        data.put("collectionPlaylists",collectionPlaylists);
        data.put("songs",songs);
        data.put("mySongs",mySongs);
        data.put("fans",fans);
        data.put("concerns",concerns);
        String json = gson.toJson(data);
        resp.getWriter().write(json);


        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void concern(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String herMailbox = req.getParameter("user");
        String myMailbox = req.getParameter("fans");
        String flag = req.getParameter("flag");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        if("1".equals(flag)){
            //我要关注他
            mapper.addConcern(myMailbox,herMailbox);
        }else if("-1".equals(flag)){
            //他被我取消关注了
            mapper.deleteConcern(myMailbox,herMailbox);
        }
        Map<String,Object> data=new HashMap<>();
        data.put("flag",flag);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void selectCommunity(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String flag = req.getParameter("flag");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        List<Community> communities = mapper.selectCommunity();
        Map<String,Object> data=new HashMap<>();
        data.put("communities",communities);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void addCnt(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String id = req.getParameter("id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        mapper.addCnt(Integer.parseInt(id));
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void selectSinger(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String cnt = req.getParameter("cnt");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        int number = mapper.selectSingerNumber();//歌手总数
        List<User> users = mapper.selectSinger(Integer.parseInt(cnt));//歌手集合
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();

        data.put("users",users);
        data.put("number",number);
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void selectByName(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String name = req.getParameter("name");
        System.out.println(1111);
        System.out.println(name);
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        User user = mapper.findByUname(name);
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        data.put("user",user);
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void selectAll(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String cnt = req.getParameter("cnt");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        int number = mapper.UserCnt();
        List<User> users = mapper.selectALL1(Integer.parseInt(cnt));
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        data.put("users",users);
        data.put("number",number);
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void changeState(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String flag = req.getParameter("flag");
        String name = req.getParameter("name");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        if("冻结".equals(flag)){
            mapper.changeState_yes(name);
        }else {
            mapper.changeState_no(name);
        }
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

}










