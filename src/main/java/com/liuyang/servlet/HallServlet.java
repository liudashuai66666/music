package com.liuyang.servlet;

import com.google.gson.Gson;
import com.liuyang.mapper.PlaylistMapper;
import com.liuyang.mapper.SongMapper;
import com.liuyang.pojo.Playlist;
import com.liuyang.pojo.Song;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.session.SqlSession;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/hallServlet")
public class HallServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        request.setCharacterEncoding("utf-8");
        //1.接收用户数据
        /*JSONObject jsonRequest = GetJsonObject.getJsonObject(request);
        String flag = jsonRequest.getString("flag");*/
        /*POST请求获取数据*/

        String flag = request.getParameter("flag");
        /*get请求获取数据*/
        Gson gson=new Gson();
        Map<String,Object> data=new HashMap<>();
        System.out.println(flag);
        if("初始化界面".equals(flag)){
            List<Playlist> playlists = initialize();
            //List<Song> songs = initialize_Song();
            data.put("playlists",playlists);
            //data.put("songs",songs);
        }
        String json = gson.toJson(data);
        response.getWriter().write(json);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    private List<Playlist> initialize() throws IOException {
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        PlaylistMapper mapper = sqlSession.getMapper(PlaylistMapper.class);
        List<Playlist> playlists = mapper.selectALL();
        return playlists;
    }
    private List<Song> initialize_Song() throws IOException {
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        List<Song> songs = mapper.selectALL();
        return songs;
    }
}






























