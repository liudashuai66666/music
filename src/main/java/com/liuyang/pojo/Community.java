package com.liuyang.pojo;

import com.sun.xml.internal.ws.api.server.SDDocument;

public class Community {
    private int id;
    private String mailbox;
    private String img;
    private String text;
    private int song_id;
    private int playlist_id;
    private int singer_name;
    private String name;
    private String avatar;
    private String send_time;
    private String types;

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

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getSong_id() {
        return song_id;
    }

    public void setSong_id(int song_id) {
        this.song_id = song_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getSend_time() {
        return send_time;
    }

    public void setSend_time(String send_time) {
        this.send_time = send_time;
    }

    public int getPlaylist_id() {
        return playlist_id;
    }

    public void setPlaylist_id(int playlist_id) {
        this.playlist_id = playlist_id;
    }

    public int getSinger_name() {
        return singer_name;
    }

    public void setSinger_name(int singer_name) {
        this.singer_name = singer_name;
    }

    public String getTypes() {
        return types;
    }

    public void setTypes(String types) {
        this.types = types;
    }

    @Override
    public String toString() {
        return "Community{" +
                "id=" + id +
                ", mailbox='" + mailbox + '\'' +
                ", img='" + img + '\'' +
                ", text='" + text + '\'' +
                ", song_id=" + song_id +
                ", playlist_id=" + playlist_id +
                ", singer_name=" + singer_name +
                ", name='" + name + '\'' +
                ", avatar='" + avatar + '\'' +
                ", send_time='" + send_time + '\'' +
                ", types='" + types + '\'' +
                '}';
    }
}
