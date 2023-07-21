package com.liuyang.text;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.junit.Test;

import java.util.Date;
import java.util.UUID;

public class text1 {
    private long time = 1000 * 60 * 60 * 24;
    private String signature = "admin";

    // 生成安全的签名密钥
    byte[] key = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
    @Test
    public void jwt() {
        JwtBuilder jwtBuilder = Jwts.builder();

        String jwt = jwtBuilder
                // Header
                .setHeaderParam("typ", "Jwt")
                .setHeaderParam("alg", "HS256")
                // Payload
                .claim("username", "tom")
                .claim("role", "admin")
                // 主题
                .setSubject("admit-text")
                // 有效时间
                .setExpiration(new Date(System.currentTimeMillis() + time))
                .setId(UUID.randomUUID().toString())
                // Signature
                .signWith(SignatureAlgorithm.HS256, Keys.hmacShaKeyFor(key))
                // 将三部分拼接起来
                .compact();

        System.out.println("JWT: " + jwt);
        //得到jwt中的数据
        Jws<Claims> claims = Jwts.parser().setSigningKey(key).parseClaimsJws(jwt);
        Claims body = claims.getBody();

        String username = body.get("username", String.class);
        String role = body.get("role", String.class);
        String subject = body.getSubject();
        Long expiration = body.getExpiration().getTime();
        String jti = body.getId();

        System.out.println("Username: " + username);
        System.out.println("Role: " + role);
        System.out.println("Subject: " + subject);
        System.out.println("Expiration: " + expiration);
        System.out.println("JWT ID: " + jti);
    }

}