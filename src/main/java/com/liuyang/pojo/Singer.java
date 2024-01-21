package com.liuyang.pojo;

public class Singer {
    private User user;
    private Song song;
    private int id;
    private String uname;
    private int song_id;
    private String time;
    private String state;
    /*
    * 状态
    * 待审核
    * 审核通过
    * 审核未通过
    * */


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public int getSong_id() {
        return song_id;
    }

    public void setSong_id(int song_id) {
        this.song_id = song_id;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return "Singer{" +
                "user=" + user +
                ", song=" + song +
                ", id=" + id +
                ", uname='" + uname + '\'' +
                ", song_id=" + song_id +
                ", time='" + time + '\'' +
                ", state='" + state + '\'' +
                '}';
    }
}
