package com.liuyang.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SHA1 {
    public static String computeSHA1(String s) {
        try {
            byte[] content=s.getBytes();
            MessageDigest sha1 = MessageDigest.getInstance("SHA1");
            return new String(sha1.digest(content));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}