package com.liuyang.mapper;

import com.liuyang.pojo.Community;
import com.liuyang.pojo.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
    List<User> selectALL1(int cnt);
    List<User> selectALL();
    void deleteById(String username);
    int InsertUser(User user);
    int UserCnt();
    User select(@Param("mailbox") String mailbox, @Param("password") String password);
    User findByMailbox(String mailbox);/*通过邮箱查找用户存在与否*/
    User selectByMailbox(String mailbox);/*通过邮箱查找用户存在与否*/
    User findByUname(String Username);/*通过邮箱查找用户存在与否*/

    int changeMsg(@Param("newName") String newName,@Param("signature") String signature,@Param("avatar") String avatar,@Param("oldName") String oldName);

    int changeUname(@Param("newName") String newName,@Param("oldName") String oldName);

    int changeSongAuthor(@Param("newName") String newName,@Param("oldName") String oldName);

    User selectByCommentId(int id);
    List<User> selectFans(String myMailbox);
    List<User> selectConcern(String myMailbox);
    int addConcern(@Param("fans") String myMailbox,@Param("user") String herMailbox);
    int deleteConcern(@Param("fans") String myMailbox,@Param("user") String herMailbox);

    List<User> selectDoText(String name);

    List<Community> selectCommunity();

    int selectSingerNumber();

    List<User> selectSinger(int cnt);
    int changeState_yes(String name);
    int changeState_no(String name);
}









