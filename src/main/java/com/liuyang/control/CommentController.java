package com.liuyang.control;

import com.google.gson.Gson;
import com.liuyang.mapper.CommentMapper;
import com.liuyang.mapper.PlaylistMapper;
import com.liuyang.mapper.SongMapper;
import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.Comment;
import com.liuyang.pojo.Playlist;
import com.liuyang.pojo.Song;
import com.liuyang.pojo.User;
import com.liuyang.pojo.vo.MessageModel;
import com.liuyang.service.UserService;
import com.liuyang.servlet.UserServlet;
import com.liuyang.util.*;
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@WebServlet("/comment/*")
@MultipartConfig
public class CommentController extends UserServlet {
    /**
     * url标识，需要替换到这个字符串
     * 替换掉后的字符串，就是真正要执行的方法
     */
    String uriReplace = "/Ly/comment/";
    private UserService service = new UserService();

    @Override
    public String getUriReplace() {
        return this.uriReplace;
    }

    public void selectCommentBySongId(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String song_id = req.getParameter("song_id");
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        CommentMapper commentMapper = sqlSession.getMapper(CommentMapper.class);//评论mapper
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);//用户mapper
        List<Comment> comments = commentMapper.selectComment_one(Integer.parseInt(song_id));
        for (int i = 0; i < comments.size(); i++) {
            User user = userMapper.selectByMailbox(comments.get(i).getMailbox());
            comments.get(i).setUser_avatar(user.getAvatar());
            comments.get(i).setUser_name(user.getUsername());

            List<Comment> comments1 = commentMapper.selectComment_two(comments.get(i).getId());

            for (int j = 0; j < comments1.size(); j++) {
                User user1 = userMapper.selectByMailbox(comments1.get(j).getMailbox());

                comments1.get(j).setUser_avatar(user1.getAvatar());
                comments1.get(j).setUser_name(user1.getUsername());

                User user2 = userMapper.selectByCommentId(comments1.get(j).getReceiver_id());
                comments1.get(j).setReceiver_name(user2.getUsername());
            }
            comments.get(i).setList(comments1);
        }
        Map<String,Object> data=new HashMap<>();
        data.put("comments",comments);
        Gson gson=new Gson();
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
    public void addComments_one(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String mailbox = req.getParameter("mailbox");
        String song_id = req.getParameter("song_id");
        String content = req.getParameter("content");
        String time = req.getParameter("time");

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        CommentMapper mapper = sqlSession.getMapper(CommentMapper.class);
        Comment comment=new Comment();
        comment.setCnt(0);
        comment.setMailbox(mailbox);
        comment.setSong_id(Integer.parseInt(song_id));
        comment.setReceiver_id(0);
        comment.setAncestor_id(0);
        comment.setTime(time);
        comment.setContent(content);
        mapper.addComments_one(comment);
        int id = mapper.getLastInsertId();
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        data.put("newId",id);
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }

    public void addComments_two(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("text/html;charset=utf-8");
        String mailbox = req.getParameter("mailbox");
        String song_id = req.getParameter("song_id");
        String content = req.getParameter("content");
        String time = req.getParameter("time");
        String ancestor_id = req.getParameter("ancestor_id");
        String receiver_id = req.getParameter("receiver_id");

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        CommentMapper mapper = sqlSession.getMapper(CommentMapper.class);
        Comment comment=new Comment();
        comment.setCnt(0);
        comment.setMailbox(mailbox);
        comment.setSong_id(Integer.parseInt(song_id));
        comment.setReceiver_id(Integer.parseInt(receiver_id));
        comment.setAncestor_id(Integer.parseInt(ancestor_id));
        comment.setTime(time);
        comment.setContent(content);
        mapper.addComments_one(comment);
        int id = mapper.getLastInsertId();
        Map<String,Object> data=new HashMap<>();
        Gson gson=new Gson();
        data.put("newId",id);
        String json = gson.toJson(data);
        resp.getWriter().write(json);
        //2.5 释放资源
        sqlSession.commit();
        //提交事务
        sqlSession.close();
    }
}





















