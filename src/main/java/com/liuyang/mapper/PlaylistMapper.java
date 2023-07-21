package com.liuyang.mapper;

import com.liuyang.pojo.Playlist;

import java.util.List;

public interface PlaylistMapper {
    List<Playlist> selectALL();
    List<Playlist> selectPlayList();
    List<Playlist> selectStyle(String style);
}
