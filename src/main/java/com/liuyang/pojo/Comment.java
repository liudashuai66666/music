package com.liuyang.pojo;

import java.util.List;

public class Comment {
    private int id;                 //评论的id
    private String mailbox;         //评论者的邮箱
    private int song_id;            //评论的歌曲id
    private int receiver_id;        //你回复的那条评论的id，如果为null则是一级评论
    private int ancestor_id;        //祖先id，对应一级评论的id
    private String time;            //评论的时间
    private String content;         //评论的内容
    private int cnt;                //点赞量
    private List<Comment> list;     //二级评论
    private String user_avatar;     //评论者的头像
    private String user_name;       //评论者的名字
    private String receiver_name;   //你回复的那个人的名字
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMailbox() {
        return mailbox;
    }

    public void setMailbox(String mailbox) {
        this.mailbox = mailbox;
    }

    public int getSong_id() {
        return song_id;
    }

    public void setSong_id(int song_id) {
        this.song_id = song_id;
    }

    public int getReceiver_id() {
        return receiver_id;
    }

    public void setReceiver_id(int receiver_id) {
        this.receiver_id = receiver_id;
    }

    public int getAncestor_id() {
        return ancestor_id;
    }

    public void setAncestor_id(int ancestor_id) {
        this.ancestor_id = ancestor_id;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getCnt() {
        return cnt;
    }

    public void setCnt(int cnt) {
        this.cnt = cnt;
    }

    public List<Comment> getList() {
        return list;
    }

    public void setList(List<Comment> list) {
        this.list = list;
    }

    public String getUser_avatar() {
        return user_avatar;
    }

    public void setUser_avatar(String user_avatar) {
        this.user_avatar = user_avatar;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getReceiver_name() {
        return receiver_name;
    }

    public void setReceiver_name(String receiver_name) {
        this.receiver_name = receiver_name;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", mailbox='" + mailbox + '\'' +
                ", song_id=" + song_id +
                ", receiver_id=" + receiver_id +
                ", ancestor_id=" + ancestor_id +
                ", time='" + time + '\'' +
                ", content='" + content + '\'' +
                ", cnt=" + cnt +
                ", list=" + list +
                ", user_avatar='" + user_avatar + '\'' +
                ", user_name='" + user_name + '\'' +
                ", receiver_name='" + receiver_name + '\'' +
                '}';
    }
}
