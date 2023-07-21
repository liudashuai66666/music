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

@WebServlet("/mySongServlet")
public class MySongServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        request.setCharacterEncoding("utf-8");
        //1.接收用户数据
        /*JSONObject jsonRequest = GetJsonObject.getJsonObject(request);
        String flag = jsonRequest.getString("flag");*/
        /*POST请求获取数据*/
        String uname = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("uname")) { // 替换成你的 Cookie 名称
                    uname = cookie.getValue();
                    break;
                }
            }
        }
        String flag = request.getParameter("flag");
        Gson gson=new Gson();
        Map<String,Object> data=new HashMap<>();
        System.out.println(flag);
        if("初始化界面".equals(flag)){
            List<Song> songs = myLike(uname);
            data.put("songs",songs);
        }
        String json = gson.toJson(data);
        response.getWriter().write(json);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    public List<Song>  myLike(String uname) throws IOException {
        SqlSession sqlSession = GetSqlSession.createSqlSession();
        SongMapper mapper = sqlSession.getMapper(SongMapper.class);
        System.out.println(uname);
        List<Song> songs = mapper.selectLike(uname);
        return songs;
    }
}
