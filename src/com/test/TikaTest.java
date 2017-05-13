package com.test;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;

public class TikaTest {

  public static void main(String[] args) {
    try {
      // test1();
      // test2();
      test3();
    } catch (Exception e) {
      System.err.println(e);
    }
  }

  protected static void test1() throws Exception {
    InputStream is = new FileInputStream("./doc/t007.doc");
    Tika tika = new Tika();
    try {
      String s = tika.parseToString(is);
      System.out.println(s);
    } finally {
      is.close();
    }
  }

  protected static void test2() throws Exception {
    InputStream stream = new FileInputStream("./doc/t007.doc");
    AutoDetectParser parser = new AutoDetectParser();
    BodyContentHandler handler = new BodyContentHandler();
    Metadata metadata = new Metadata();
    try {
      parser.parse(stream, handler, metadata);
      String[] names = metadata.names();
      for (int i = 0; i < names.length; i++) {
        System.out.println(names[i]);
      }
      handler.startDocument();
      handler.endDocument();
      System.out.println(handler.toString());
    } finally {
      stream.close();
    }
  }

  protected static void test3() throws Exception {
    Map<String, Integer> map = new HashMap<String, Integer>();
    map.put("de", 10);
    map.put("ab", 20);
    map.put("a", 5);
    Map<String, Integer> map2 = sortByValues(map);

    for (Map.Entry<String, Integer> pair : map2.entrySet()) {
      System.out.println(pair.getKey() + ":" + pair.getValue());
    }
    // Map<String, Integer> m2 = new TreeMap<String, Integer>(comparator);
  }
  
  protected static Map<String, Integer> sortByValues(final Map<String, Integer> map) {
    Comparator<String> valueComparator = new Comparator<String>() {
      public int compare(String k1, String k2) {
        Integer v1 = map.get(k1);
        Integer v2 = map.get(k2);
        if (v1 < v2)
          return -1;
        else if (v1 == v2)
          return 0;
        else 
          return 1;
      }
    };

    Map<String, Integer> sortedByValues = new TreeMap(valueComparator);
    sortedByValues.putAll(map);
    return sortedByValues;
  }
}

