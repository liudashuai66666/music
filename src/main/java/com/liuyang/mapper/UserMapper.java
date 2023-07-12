package com.liuyang.mapper;

import com.liuyang.pojo.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
    List<User> selectALL();
    void deleteById(String username);
    int InsertUser(User user);
    User select(@Param("mailbox") String mailbox, @Param("password") String password);
    User findByMailbox(String mailbox);/*通过邮箱查找用户存在与否*/
    User findByUname(String Username);/*通过邮箱查找用户存在与否*/
}









