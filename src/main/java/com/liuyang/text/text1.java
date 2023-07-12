package com.liuyang.text;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.junit.Test;

import java.util.Date;
import java.util.UUID;

public class text1 {
    private long time = 1000 * 60 * 60 * 24;

    // 生成安全的签名密钥
    private byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();

    @Test
    public void jwt() {
        JwtBuilder jwtBuilder = Jwts.builder();
        // 创建jwtBuilder对象

        String jwtBuilder1 = jwtBuilder
                .setHeaderParam("alg", "HS256")
                .setHeaderParam("typ", "Jwt")
                .claim("username", "tom")
                .claim("role", "admin")
                .setSubject("admit-text")
                .setExpiration(new Date(System.currentTimeMillis() + time))
                .setId(UUID.randomUUID().toString())
                .signWith(SignatureAlgorithm.HS256, keyBytes)
                .compact();
        System.out.println(jwtBuilder1);
    }

    @Test
    public void parse(){
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp3dCJ9.eyJ1c2VybmFtZSI6InRvbSIsInJvbGUiOiJhZG1pbiIsInN1YiI6ImFkbWl0LXRleHQiLCJleHAiOjE2ODg4MDQ3MjksImp0aSI6IjJmM2JmMTQzLTUxMTQtNDE4Ny04OWU2LWM5ZjE2NDQxYzk4ZiJ9.s8AfX1h3RgUn0Q75L7hKpj9JxuWYmtItVe56v1MZkPU";
        JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(keyBytes).build(); // 使用生成JWT时的密钥
        Jws<Claims> claimsJws = jwtParser.parseClaimsJws(token);
        Claims body = claimsJws.getBody();
        System.out.println(body.get("username"));
        System.out.println(body.get("role"));
        System.out.println(body.getId());
        System.out.println(body.getExpiration());
    }
}



















