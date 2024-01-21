package com.liuyang.text;

import com.liuyang.mapper.PlaylistMapper;
import com.liuyang.mapper.UserMapper;
import com.liuyang.pojo.Playlist;
import com.liuyang.pojo.User;
import com.liuyang.util.GetSqlSession;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;
import java.util.*;

/**
 * @author 23852
 */
public class ItemCF {

    public static void main(String[] args) throws IOException {
        // 初始化用户-物品评分矩阵
        // 用户-物品评分矩阵
        Map<Integer, List<Integer>> userItemMatrix = new HashMap<>();
        // 每个用户收藏的歌单

        SqlSession sqlSession = GetSqlSession.createSqlSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        PlaylistMapper playlistMapper = sqlSession.getMapper(PlaylistMapper.class);
        //得到所有的用户
        List<User> users = mapper.selectALL();
        for (User user : users) {
            userItemMatrix.put(user.getId(), new ArrayList<Integer>());
            String mailbox = user.getMailbox();
            List<Playlist> playlists = playlistMapper.selectCollectionPlaylist(mailbox);//得到该用户收藏的歌单
            for (Playlist playlist : playlists) {
                userItemMatrix.get(user.getId()).add(playlist.getId());
            }
        }

        Map<Integer,Integer> playlistCnt = new HashMap<>();
        List<Playlist> playlists = playlistMapper.selectALL();
        for (Playlist playlist : playlists) {
            int cnt = playlistMapper.selectPlayCnt(playlist.getId());
            playlistCnt.put(playlist.getId(),cnt);
        }
        // 初始化共现矩阵的哈希表
        Map<Integer, Map<Integer, Integer>> cooccurrenceMatrix = new HashMap<>();
        // 构建共现矩阵
        for (Map.Entry<Integer, List<Integer>> entry : userItemMatrix.entrySet()) {
            List<Integer> itemList = entry.getValue();
            for (int i = 0; i < itemList.size(); i++) {
                for (int j = i+1; j < itemList.size(); j++) {
                    cooccurrenceMatrix.computeIfAbsent(itemList.get(i), k -> new HashMap<>()).merge(itemList.get(j), 1, Integer::sum);
                    cooccurrenceMatrix.computeIfAbsent(itemList.get(j), k -> new HashMap<>()).merge(itemList.get(i), 1, Integer::sum);
                }
            }
        }
        // 打印共现矩阵
        Map<Integer, Map<Integer, Double>> playlistSimilarity = new HashMap<>();
        for (int item1 : cooccurrenceMatrix.keySet()) {
            Map<Integer, Integer> item1Map = cooccurrenceMatrix.get(item1);
            Map<Integer, Double> integerDoubleMap = new HashMap<>();
            for (int item2 : item1Map.keySet()) {
                int count = item1Map.get(item2);
                double result = Math.sqrt((double) (playlistCnt.get(item1) * playlistCnt.get(item2)));
                double cnt = 1.0*count/result;
                integerDoubleMap.put(item2,cnt);
            }
            playlistSimilarity.put(item1,integerDoubleMap);
        }
        for (int item1 : playlistSimilarity.keySet()) {
            Map<Integer, Double> item1Map = playlistSimilarity.get(item1);
            for (int item2 : item1Map.keySet()) {
                Double count = item1Map.get(item2);
                System.out.println("(" + item1 + ", " + item2 + "): " + count);
            }
        }

        Map<Integer, Double> map = playlistSimilarity.get(16);
        // 假设已经向map中添加了键值对

        // 将Map的键值对转换为List
        List<Map.Entry<Integer, Double>> entryList = new ArrayList<>(map.entrySet());

        // 对List进行排序
        Collections.sort(entryList, new Comparator<Map.Entry<Integer, Double>>() {
            @Override
            public int compare(Map.Entry<Integer, Double> entry1, Map.Entry<Integer, Double> entry2) {
                // 降序排序
                return entry2.getValue().compareTo(entry1.getValue());
            }
        });

        // 输出排序后的结果
        System.out.println("Sorted Map:");
        for (int i = 0; i < Math.min(5, entryList.size()); i++) {
            Map.Entry<Integer, Double> entry = entryList.get(i);
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }


    }
}