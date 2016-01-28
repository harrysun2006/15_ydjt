package com.test;

import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.zip.GZIPOutputStream;

import javax.imageio.ImageIO;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import net.arnx.wmf2svg.gdi.svg.SvgGdi;
import net.arnx.wmf2svg.gdi.wmf.WmfParser;

import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.converter.PicturesManager;
import org.apache.poi.hwpf.converter.WordToHtmlConverter;
import org.apache.poi.hwpf.usermodel.Picture;
import org.apache.poi.hwpf.usermodel.PictureType;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.graphics.ImageData;
import org.eclipse.swt.graphics.ImageLoader;
import org.eclipse.swt.widgets.Display;
import org.w3c.dom.Document;


// http://chembo.iteye.com/blog/1510536
// http://haohaoxuexi.iteye.com/blog/2031715
// http://haohaoxuexi.iteye.com/blog/2031335
// http://bbs.csdn.net/topics/390639618
public class PoiTest3 {

  public static void main(String argv[]) {
    try {
      convert2Html(".\\doc\\t007.doc", ".\\doc\\t007.html");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static void writeFile(String content, String path) {
    FileOutputStream fos = null;
    BufferedWriter bw = null;
    try {
      File file = new File(path);
      fos = new FileOutputStream(file);
      bw = new BufferedWriter(new OutputStreamWriter(fos, "GB2312"));
      bw.write(content);
    } catch (FileNotFoundException fnfe) {
      fnfe.printStackTrace();
    } catch (IOException ioe) {
      ioe.printStackTrace();
    } finally {
      try {
        if (bw != null)
          bw.close();
        if (fos != null)
          fos.close();
      } catch (IOException ie) {
      }
    }
  }

  public static void convert2Html(String fileName, String outPutFile)
      throws TransformerException, IOException, ParserConfigurationException {
    HWPFDocument wordDocument = new HWPFDocument(new FileInputStream(fileName));// WordToHtmlUtils.loadDoc(new
                                                                                // FileInputStream(inputFile));
    WordToHtmlConverter wordToHtmlConverter = new WordToHtmlConverter(
        DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument());
    wordToHtmlConverter.setPicturesManager(new PicturesManager() {
      public String savePicture(byte[] content, PictureType pictureType,
          String suggestedName, float widthInches, float heightInches) {
        // System.out.println(suggestedName);
        String name = "./t007/" + suggestedName;
        try {
          if (pictureType.equals(PictureType.WMF)) {
            name = convert2PNG(content, suggestedName, widthInches, heightInches);
          } else {
            OutputStream os = new FileOutputStream(new File("./doc/", name));
            os.write(content);
            os.close();
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
        System.out.println(name);
        return name;
      }
      
      // https://github.com/haraldk/TwelveMonkeys
      private String convert2PNG(byte[] content, String suggestedName, float widthInches, float heightInches) throws Exception {
        File wmf = new File("./doc/t007/", suggestedName);
        OutputStream os = new FileOutputStream(wmf);
        os.write(content);
        os.close();
        
        int i = suggestedName.lastIndexOf('.');
        String name = suggestedName.substring(0, i) + ".png";
        convert1(content, name, widthInches, heightInches);
        // convert2(wmf, name);
        // convert3(suggestedName, name);
        return "./t007/" + name;
      }
      
      // http://stackoverflow.com/questions/6788114/how-do-we-convert-wmf-emf-ms-metafiles-into-standard-images-like-jpg-or-png-us
      // http://blog.sina.com.cn/s/blog_746886bc0101iohl.html
      private void convert1(byte[] content, String name, float widthInches, float heightInches) throws Exception {
        ByteArrayOutputStream b1 = new ByteArrayOutputStream();
        
        /*
        TranscoderInput i1 = new TranscoderInput(new ByteArrayInputStream(content));
        TranscoderOutput o1 = new TranscoderOutput(b1);
        WMFTranscoder t1 = new WMFTranscoder();
        TranscodingHints hints=new TranscodingHints();
        hints.put(WMFTranscoder.KEY_HEIGHT, heightInches*96);
        hints.put(WMFTranscoder.KEY_WIDTH, widthInches*96);
        
        t1.setTranscodingHints(hints);
        t1.transcode(i1, o1);
        */
        InputStream in = new ByteArrayInputStream(content);
        WmfParser parser = new WmfParser();
        final SvgGdi gdi = new SvgGdi(false);
        parser.parse(in, gdi);
        Document doc = gdi.getDocument();
        int i = name.lastIndexOf('.');
        String svg = name.substring(0, i) + ".svg";
        OutputStream out = new FileOutputStream("./doc/t007/" + svg);

        TransformerFactory factory = TransformerFactory.newInstance();
        Transformer transformer = factory.newTransformer();
        transformer.setOutputProperty(OutputKeys.METHOD, "xml");
        transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty(OutputKeys.DOCTYPE_PUBLIC,"-//W3C//DTD SVG 1.0//EN");
        transformer.setOutputProperty(OutputKeys.DOCTYPE_SYSTEM,"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd");
        transformer.transform(new DOMSource(doc), new StreamResult(out));
        out.flush();
        out.close();
        
        PNGTranscoder t2 = new PNGTranscoder();
        TranscoderInput i2 = new TranscoderInput(new FileInputStream("./doc/t007/" + svg));
        TranscoderOutput o2 = new TranscoderOutput(new FileOutputStream(new File("./doc/t007/", name)));
        // t2.setTranscodingHints(hints);
        t2.transcode(i2, o2);
      }
      
      private void convert2(File wmf, String name) throws Exception {
        File png = new File("./doc/t007", name);
        ImageIO.write(ImageIO.read(wmf), "png", png);
      }
      
      private void convert3(String wmf, String png) throws Exception {
        Image image = new Image(Display.getCurrent(), "./doc/t007/" + wmf);                
        ImageLoader loader = new ImageLoader();
        loader.data = new ImageData[] { image.getImageData() };
        try(FileOutputStream stream = new FileOutputStream("./doc/t007/" + png))
        {
            loader.save(stream, SWT.IMAGE_PNG);
        }
        image.dispose();
      }
    });
    
    wordToHtmlConverter.processDocument(wordDocument);
    // save pictures
    List pics = wordDocument.getPicturesTable().getAllPictures();
    if (pics != null) {
      for (int i = 0; i < pics.size(); i++) {
        Picture pic = (Picture) pics.get(i);
        /*
         * try { System.out.println(pic.suggestFullFileName() + ": " +
         * pic.suggestPictureType()); pic.writeImageContent(new
         * FileOutputStream(".\\doc\\t007\\" + pic.suggestFullFileName())); }
         * catch (FileNotFoundException e) { e.printStackTrace(); }
         */
      }
    }
    Document htmlDocument = wordToHtmlConverter.getDocument();
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    DOMSource domSource = new DOMSource(htmlDocument);
    StreamResult streamResult = new StreamResult(out);

    TransformerFactory tf = TransformerFactory.newInstance();
    Transformer serializer = tf.newTransformer();
    serializer.setOutputProperty(OutputKeys.ENCODING, "utf-8");
    serializer.setOutputProperty(OutputKeys.INDENT, "yes");
    serializer.setOutputProperty(OutputKeys.METHOD, "html");
    serializer.transform(domSource, streamResult);
    out.close();
    writeFile(new String(out.toByteArray()), outPutFile);
  }
}
