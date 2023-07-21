package com.liuyang.mapper;

import com.liuyang.pojo.Playlist;
import com.liuyang.pojo.Song;

import java.util.List;

public interface SongMapper {
    List<Song> selectALL();
    List<Song> selectLike(String uname);
}
