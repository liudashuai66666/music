package com.liuyang.util;

import io.jsonwebtoken.io.IOException;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class GetJsonObject {
    public static JSONObject getJsonObject(HttpServletRequest request) throws IOException, java.io.IOException {
        // 读取请求体数据
        // StringBuilder是Java中的一个类，
        // 用于处理可变的字符串。它提供了一组方法，可以方便地进行字符串的拼接、插入和删除操作。
        StringBuilder requestBody = new StringBuilder();
        //BufferedReader是一个带有缓冲区的字符输入流。
        BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String line;
        //每次读一行数据，”一行“指的是以换行符为界线
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }
        //System.out.println("requestBody  : "+requestBody);
        // 解析JSON请求体数据
        JSONObject jsonRequest = new JSONObject(requestBody.toString());
        return jsonRequest;
    }
}
