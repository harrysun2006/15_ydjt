package com.test;

import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;

public class TikaTest {

  public static void main(String[] args) {
    try {
      // test1();
      test2();
    } catch(Exception e) {
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
        // System.out.println(handler.toString());
    } finally {
        stream.close();
    }
  }
}
