package com.liuyang.mapper;

import com.liuyang.pojo.Playlist;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PlaylistMapper {
    List<Playlist> selectALL();
    List<Playlist> selectPlayList();
    List<Playlist> selectStyle(String style);

    Playlist selectByID(int id);
    List<Playlist> selectHot();
    List<Playlist> selectPersonality();
    List<Playlist> selectByAuthor(String author);
    int createPlaylist(Playlist playlist);

    Playlist selectNewPlaylist();
    int revisePlayliet(@Param("id") int id, @Param("name") String name, @Param("img") String img,@Param("description") String description);
    int deletePlaylist(int id);
    int addCnt(int id);/*播放次数增加*/
    int deletePlaylistStyle(int id);/*删除歌曲风格*/
    int deletePlaylistSong(int id);
    int delete_likeSong(@Param("mailbox") String mailbox,@Param("song_id") int song_id);/*从我喜欢中删除*/
    int delete_playlistSong(@Param("list_id") int list_id,@Param("song_id") int song_id);/*从指定歌单中删除歌曲*/
    int addSong_to_playlist(@Param("list_id") int list_id,@Param("song_id") int song_id);/*在指定歌单中添加歌曲*/
    Integer selectBySong(@Param("list_id") int list_id,@Param("song_id") int song_id);/*查找该歌曲是否在该歌单中*/
    Integer selectBySongLike(@Param("mailbox") String mailbox,@Param("song_id") int song_id);/*查找歌曲是否是自己的喜欢*/
    int addSong_to_like(@Param("mailbox") String mailbox,@Param("song_id") int song_id);/*在我喜欢中添加歌曲*/
    List<String> selectLabel(int id);
    int createStyle(@Param("list_id") int id,@Param("style") String style);
    List<Playlist> selectCollectionPlaylist(String mailbox);/*查找用户收藏的歌单*/

    int addCollectionPlaylist(@Param("mailbox") String mailbox, @Param("list_id") int list_id);/*新建收藏*/
    int deleteCollectionPlaylist(@Param("mailbox") String mailbox, @Param("list_id") int list_id);/*删除收藏*/

    List<Playlist> selectPlaylistDoText(String name);

    int selectPlayCnt(int id);



}
