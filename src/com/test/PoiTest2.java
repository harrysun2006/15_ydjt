package com.test;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.converter.WordToHtmlConverter;
import org.apache.poi.hwpf.model.PicturesTable;
import org.apache.poi.hwpf.usermodel.CharacterRun;
import org.apache.poi.hwpf.usermodel.Picture;
import org.apache.poi.hwpf.usermodel.Range;

public class PoiTest2 {

  // 回车符ASCII
  private static final short ENTER_ASCII = 13;
  // 空格符ASCII
  private static final short SPACE_ASCII = 32;
  // 水平制表符
  private static final short TABULATION_ASCII = 9;
  private String htmlText = "";

  public static void main(String[] args) throws Exception {
    String fileName = ".\\doc\\t007.doc";
    PoiTest2 pt = new PoiTest2();
    String s = pt.getWordAndStyle(fileName);
    System.out.println(pt.htmlText);
    pt.convertToHtml();
  }

  // 读取每个字符样式
  public String getWordAndStyle(String path) throws Exception {

    File file = new File(path);
    FileInputStream in = new FileInputStream(file.getAbsolutePath());
    HWPFDocument doc = new HWPFDocument(in);
    int length = doc.characterLength();
    PicturesTable pTable = doc.getPicturesTable();
    htmlText = "<h3 align='center'>" + doc.getSummaryInformation().getTitle()
        + "</h3>";
    int TitleLength = doc.getSummaryInformation().getTitle().length();
    int imgBegin = 0;
    int imgEnd = 0;
    String tempString = "";
    String picpath = "";
    char currentChar = ' ';
    int rowCount = 0;
    for (int i = TitleLength; i < length - 1; i++) {
      Range range = new Range(i, i + 1, doc);

      CharacterRun cr = range.getCharacterRun(0);
      System.out.print(currentChar);
      // System.out.print(pTable.hasPicture(cr));
      if (pTable.hasPicture(cr)) {

        // 获取图片路径
        picpath = this.readPicture(pTable, cr);

        currentChar = cr.text().charAt(0);
        tempString += picpath + "<br/>";

      } else {
        Range range2 = new Range(i + 1, i + 2, doc);
        CharacterRun cr2 = range.getCharacterRun(0);
        currentChar = cr.text().charAt(0);
        // System.out.print(currentChar + "字符");
        if (currentChar == ENTER_ASCII) {
          tempString += "<br/>";

        } else if (currentChar == SPACE_ASCII)
          tempString += "&nbsp;";
        else if (currentChar == TABULATION_ASCII)
          tempString += "&nbsp;&nbsp;&nbsp;";
        boolean flag = compareCharStyle(cr, cr2);
        String fontStyle = "<span style='font-family:" + cr.getFontName()
            + ";font-size:" + cr.getFontSize() / 2 + "pt";
        if (cr.isBold())
          fontStyle += "font-weight:bold";
        if (cr.isItalic())
          fontStyle += "font-style:italic";
        if (flag && i != length - 2)
          tempString += currentChar;
        else if (!flag) {
          htmlText += fontStyle + "'>" + tempString + currentChar + "</span>";
          tempString = "";

        } else
          htmlText += fontStyle + "'>" + tempString + currentChar + "</span>";

      }

    }
    imgBegin = htmlText.indexOf("INCLUDEPICTURE");

    imgEnd = htmlText.indexOf("<img src=");
    // String str=htmlText.

    // cr.text().getChars(srcBegin, srcEnd, dst, dstBegin);
    // String str=htmlText.substring(imgBegin, imgEnd);
    // htmlText=htmlText.replaceAll(str,"&nbsp;");
    // System.out.println("字符"+str+"结束");
    // System.out.println("起始"+imgBegin);
    // System.out.println("结束"+imgEnd);
    System.out.println("文章" + htmlText);
    return htmlText;
  }

  // 返回图片的路径
  private String readPicture(PicturesTable pTable, CharacterRun cr)
      throws Exception {

    String picpath = "";
    Picture pic = pTable.extractPicture(cr, false);

    String afileName = pic.suggestFullFileName();
    OutputStream out = new FileOutputStream(new File("d:\\Temp\\22"
        + File.separator + afileName));
    pic.writeImageContent(out);
    // htmlText+="<img src='d:\\text\\"+afileName+"'/>";
    picpath = "<img src='d:\\Temp\\22\\" + afileName + "'/>";
    // System.out.println(picpath);
    return picpath;
  }

  private boolean compareCharStyle(CharacterRun cr1, CharacterRun cr2) {

    boolean flag = false;
    if (cr1.isBold() == cr2.isBold() && cr1.isItalic() == cr2.isItalic()
        && cr1.getFontName().equals(cr2.getFontName())
        && cr1.getFontSize() == cr2.getFontSize()) {

      flag = true;
    }
    return flag;
  }

  private void writeFile(String s) {
    FileOutputStream fos = null;
    BufferedWriter bw = null;
    try {
      File file = new File("e:\\abc.html");
      fos = new FileOutputStream(file);
      bw = new BufferedWriter(new OutputStreamWriter(fos));
      bw.write(s);
    } catch (Exception e) {
      // TODO: handle exception
      e.printStackTrace();
    } finally {
      try {
        if (bw != null)
          bw.close();
        if (fos != null)
          fos.close();
      } catch (Exception e2) {
        // TODO: handle exception
        e2.printStackTrace();
      }
    }
  }

  public void convertToHtml() throws Exception {
    InputStream is = new FileInputStream(".\\doc\\t007.doc");
    HWPFDocument wordDocument = new HWPFDocument(is);
    WordToHtmlConverter converter = new WordToHtmlConverter(
        DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument());
    // 对HWPFDocument进行转换
    converter.processDocument(wordDocument);
    Writer writer = new FileWriter(new File(".\\doc\\t007.html"));
    Transformer transformer = TransformerFactory.newInstance().newTransformer();
    transformer.setOutputProperty(OutputKeys.ENCODING, "utf-8");
    // 是否添加空格
    transformer.setOutputProperty(OutputKeys.INDENT, "yes");
    transformer.setOutputProperty(OutputKeys.METHOD, "html");
    transformer.transform(new DOMSource(converter.getDocument()),
        new StreamResult(writer));
  }
}
