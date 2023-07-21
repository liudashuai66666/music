package com.liuyang.util;

import io.jsonwebtoken.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;


public class JWTUtils {
    private static final String key="1314520qwe";
    //创建短令牌
    public static String createToken(Object data){
        Map<String, Object> claims=new HashMap<>();
        claims.put("data",data);
        JwtBuilder jwtBuilder= Jwts.builder()
                .signWith(SignatureAlgorithm.HS256,key) //签发算法，密钥为key
                .addClaims(claims)  //body数据，要唯一，自行设置
                .setIssuedAt(new Date())    //设置签发时间
                .setExpiration(new Date(System.currentTimeMillis()+30*60*1000));  //有效时间，这个是半个小时
        String token=jwtBuilder.compact();
        return token;//返回创建好的token
    }
    //创建长令牌
    public static String createLongToken(Object data){
        Map<String, Object> claims=new HashMap<>();
        claims.put("data",data);
        JwtBuilder jwtBuilder= Jwts.builder()
                .signWith(SignatureAlgorithm.HS256,key) //签发算法，密钥为key
                .addClaims(claims)  //body数据，要唯一，自行设置
                .setIssuedAt(new Date())    //设置签发时间
                .setExpiration(new Date(System.currentTimeMillis()+24*60*60*1000));  //有效时间，这个是一天时间
        String longToken=jwtBuilder.compact();
        return longToken;//返回创建好的token
    }

    //得到body部分
    public static Map<String,Object> checkToken(String token){
        Jwt parse = Jwts.parser().setSigningKey(key).parse(token);
        return (Map<String, Object>) parse.getBody();
    }

    //双令牌验证
    public static int pd(String token, String flag){
        System.out.println("token是否过期："+isTokenExpired(token));
        System.out.println("token的类型："+flag);
        if(!isTokenExpired(token)&&"long_token".equals(flag)){
            return 0;
        }else if(isTokenExpired(token)&&"short_token".equals(flag)){
            return 1;
        }else if(isTokenExpired(token)&&"long_token".equals(flag)){
            return 2;
        }else{
            return 3;
        }
    }

    //判断令牌是否失效
    public static boolean isTokenExpired(String token) {
        try {
            // 解析令牌
            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody();

            // 获取到令牌的过期时间
            Date expirationDate = claims.getExpiration();

            // 判断令牌是否过期
            return expirationDate.before(new Date());
        } catch (ExpiredJwtException e) {
            // 如果令牌已过期，则会抛出ExpiredJwtException异常
            return true;
        } catch (Exception e) {
            // 如果解析令牌发生其他异常，也视为令牌过期
            return true;
        }
    }
    public static void main(String[] args) {
        String token=JWTUtils.createToken(100);
        System.out.println(token);
        Map<String, Object> map = JWTUtils.checkToken(token);
        System.out.println(map.get("class"));
    }
}































