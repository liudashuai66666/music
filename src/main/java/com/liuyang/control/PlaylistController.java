package com.liuyang.control;

import com.google.gson.Gson;
import com.liuyang.mapper.PlaylistMapper;
import com.liuyang.pojo.Playlist;
import com.liuyang.servlet.PlaylistServlet;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.session.SqlSession;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/playlist/*")
public class PlaylistController extends PlaylistServlet {
    /**
     * url标识，需要替换到这个字符串
     * 替换掉后的字符串，就是真正要执行的方法
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
}

















