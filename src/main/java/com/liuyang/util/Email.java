package com.liuyang.util;

import javax.servlet.http.HttpServletResponse;

//发送邮件的方法
public class Email {
    public static void email(String mailbox, HttpServletResponse response) throws Exception {
        System.out.println("发送邮件");
        Mail mail = new Mail();
        mail.setHost("smtp.qq.com");//设置邮件服务器
        mail.setPortNumber("465");//设置邮件服务器端口号，默认25
        mail.setSender("2385272606@qq.com");
        mail.setName("黑椒音乐");//发送人
        String jieshouname = mailbox;//得到接收人的qq邮箱号
        mail.setReceiver(jieshouname);//接收人
        mail.setUsername("2385272606@qq.com");//登陆账号
        mail.setPassword("derxxygbhbomebid");//授权码
        mail.setSubject("Q-Q");
        String s = Creatcode.creatCode(6);
        mail.setMessage("您正在注册黑椒音乐，验证码为：" + s + ",该验证码在60秒内有效，切勿将该验证码交给他人！");//内容
        if(new MailUtil().send(mail)){
            //生成的验证码传给用户；
            response.getWriter().write(s);
        }else{
            response.getWriter().write("发送失败");
        }
    }
}
