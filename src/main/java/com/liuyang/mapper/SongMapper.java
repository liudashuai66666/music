package com.liuyang.mapper;



import com.liuyang.pojo.Singer;
import com.liuyang.pojo.Song;
import com.liuyang.pojo.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface SongMapper {
    List<Song> selectALL();
    List<Song> selectLike(String mailbox);

    List<Song> selectByPlaylist(int id);
    List<Song> select_rankingTime();
    List<Song> select_hotRanking();

    Song selectById(int id);
    List<Song> selectSongName(String name);
    List<Song> selectMySong(String name);
    List<Song> selectSingerSong(String name);
    Song selectNewSong();
    int addSong(Song song);
    int addSong1(Song song);
    int addSinger(@Param("name") String name,@Param("id") int id,@Param("time") String time);
    int selectSongNumber();
    int addCnt(int id);
    int updateSongState_no(int id);
    int updateSongState_yes(int id);

    int selectSingerNumber();

    /*List<Singer> selectAllSinger(int cnt);*/


    List<Song> selectNewSongs(int cnt);

    List<Song> selectNewSinger(int cnt);

    List<User> selectNewSingerUser(int cnt);

    int singerButton_no(int id);

    int deleteSongById(int id);

    void updateUserStatus(String name);
}
