package com.liuyang.mapper;

import com.liuyang.pojo.Comment;

import java.util.List;

public interface CommentMapper {
    List<Comment> selectComment_one(int song_id);
    List<Comment> selectComment_two(int ancestor_id);
    int addComments_one(Comment comment);

    int getLastInsertId();
}
