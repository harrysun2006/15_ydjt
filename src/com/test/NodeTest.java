package com.test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class NodeTest {

  public String greeting(String name) throws Exception {
    if (name == null || name.startsWith("B")) {
      System.err.println("ERROR: " + name);
      throw new Exception("An exception from java: " + name);
    }
    String r = "Hello " + name;
    System.out.println("Java: " + r);
    return r;
  }
  
  public void walk(Visitor v) {
    Map<Object, Object> m = new HashMap<Object, Object>();
    m.put(6, "China");
    m.put("au", "Australia");
    m.put("obj", new StringBuffer("Hello World!"));
    Object[] data = new Object[] {
      true, 100, Math.PI, "Aussie", m
    };
    for(int i = 0; i < data.length; i++) {
      v.visit(data[i]);
    }
  }

}
