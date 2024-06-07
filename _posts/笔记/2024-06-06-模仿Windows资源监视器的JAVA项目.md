---
title: 模仿Windows资源监视器的JAVA项目
description: 计算机操作系统课程设计项目
author: ZoZou
date: 2024-06-06 18:10 +0800
categories:
  - 笔记
tags:
  - blog
  - 项目
  - 代码
pin: false
math: true
mermaid: true
number headings: auto, first-level 1, max 6, start-at 1, _.1.1.
---
# CPU参数监控程序
## 1. 简介
本程序使用Java开发，调用oshi库和JMX库获取CPU信息，通过提供直观的监测数据和图表，用户可以更加方便地了解系统运行情况。

开发的原因主要就是操作系统课设要求，别管那么多为什么用Java了哈哈哈，为做操作系统课设的大家提供参考。
## 2. 功能分析与设计
### 2.1. 功能分析
CPU监控工具主要都是系统内置的，比如Windows的任务管理器、资源监视器、macOS活动监视器。本项目由于运行的平台为Windows，故选择资源监视器和任务管理器进行分析和参考。
![[Pasted image 20240607094928.png]]
![[Pasted image 20240607094933.png]]
由图可以看出资源监视器分为概述、CPU、内存、磁盘和网络五个板块，其中最主要的就是CPU相关的板块。在概述界面中列出了CPU的使用率、最大频率，并且在右侧用折线图的方式直观地展现了CPU使用率的变化，左侧则将进程列表展现了出来，包括进程名称、PID、描述、状态、线程数、CPU、平均CPU占比。在CPU界面中分别列出了进程列表、服务列表，还有每个逻辑处理器的使用率折线图，当用户点击选中进程时，还会将关联的句柄和关联的模块一一列举出来。

任务管理器对于CPU的部分侧重点比较不同，且信息比较简便，主要就是CPU的型号、利用率、速度、进程、线程、句柄、运行时间等信息的显示，也有像资源管理器的利用率折线图。

综上所述，一个CPU参数监控程序应该拥有的功能有：显示CPU硬件信息、显示进程信息、显示CPU利用率、显示CPU利用率折线图。额外的功能有：进程详情、结束进程、进程排序。
### 2.2. 详细设计
功能模块设计如下表所示：

|  模块   | 功能            | 功能描述                  |
| :---: | ------------- | --------------------- |
| 概述页面  | 显示CPU硬件信息     | 将CPU的型号、内核数等信息进行展示    |
|       | 显示CPU实时参数     | 将CPU的利用率、进程数等实时更新显示   |
|       | 显示CPU总利用率折线图  | 将CPU的利用率情况以折线图的形式实时绘制 |
| CPU页面 | 显示各个CPU利用率    | 将每个逻辑处理器的利用率进行展示      |
|       | 显示各个CPU利用率折线图 | 将每个逻辑处理器的利用率以折线图显示    |
| 进程页面  | 显示进程列表        | 显示当前正在运行的进程信息         |
|       | 选择并结束进程       | 用户可以结束选中的进程           |
### 2.3. 参数获取
概述模块的所需要获取的CPU参数有系统名称、CPU型号、CPU内核数、CPU逻辑处理器数、CPU总利用率、运行时间、进程数、线程数、CPU频率。本程序获取 CPU利用率要通过JMX库获取到的系统信息调用.getCpuLoad()方法。其他硬件信息和参数信息就由oshi库中的方法进行获取，具体程序如下：
```
//构造函数，计时器每秒刷新一次，与任务管理器一致  
public CPUMonitorOverview() {  
    bean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean(); //获取操作系统的相关信息  
    systemInfo = new SystemInfo();    //获取系统信息  
     hardware = systemInfo.getHardware();    //获取硬件信息  
    processor = hardware.getProcessor();    //获取CPU  
    os = systemInfo.getOperatingSystem();    //获取操作系统信息  
    CPU_PHYSICAL_PROCESSOR = processor.getPhysicalProcessorCount();    //CPU物理内核  
    CPU_LOGICAL_PROCESSOR = processor.getLogicalProcessorCount();    //CPU逻辑处理器  
    xLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点x坐标  
    yLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
    xTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点x坐标（+2是为了存储底部两个顶点坐标，绘制的是多边形）  
    yTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
    cpuTotalData = new double[MAX_DATA_POINTS];  
    timer = new Timer(1000, this); // 1秒更新一次  
    timer.start();  
}
```
CPU模块需要获取每个CPU的利用率数据，与概述模块相同，使用oshi库获得CPU信息后，使用.getProcessorCpuLoadBetweenTicks()方法就能获得一个double型的数组存储了每个CPU的利用率。程序代码如下：
```
//构造函数，计时器每秒刷新一次，与任务管理器一致  
public CPUMonitorList() {  
    bean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();  
    systemInfo = new SystemInfo();    //获取系统信息  
    hardware = systemInfo.getHardware();    //获取硬件信息  
    processor = hardware.getProcessor();    //获取CPU  
    CPU_PHYSICAL_PROCESSOR = processor.getPhysicalProcessorCount();    //CPU物理内核  
    CPU_LOGICAL_PROCESSOR = processor.getLogicalProcessorCount();    //CPU逻辑处理器  
    xLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点x坐标  
    yLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
    os = systemInfo.getOperatingSystem();    //获取操作系统信息  
    xTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点x坐标  
    yTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
    cpuTotalData = new double[MAX_DATA_POINTS];  
    cpuLoads = new double[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS];  
    timer = new Timer(1000, this); // 1秒更新一次  
    timer.start();  
}
```
进程模块需要获取进程列表，主要的信息有：名称、PID、会话名、CPU、内存使用。进程信息获取采用系统命令的方式进行，通过“tasklist”命令即可获取进程信息。使用ProcessBuilder创建一个命令进程，然后通过BufferReader读取命令的输出，谨记最后一定要使用.destory()来结束进程，不然会占用较多资源。获取进程信息程序代码如下：
```
ProcessBuilder processBuilder = new ProcessBuilder("tasklist");  
Process process = processBuilder.start();  
  
// 读取命令输出  
BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));  
String line;  
for (int i = 0; i < _MAX_DATA_POINTS_; i++) {  
    line = reader.readLine();  
    if (line != null && i >= 3) {                    //前三行没有实际数据        processList[i - 3][0] = line.substring(0, 24);       //名称        processList[i - 3][1] = line.substring(26, 34);      //PID  
        processList[i - 3][2] = line.substring(35, 43);      //会话        processList[i - 3][3] = line.substring(62, 63);      //CPU  
        processList[i - 3][4] = line.substring(63, 76);       //内存占用    }  
}  
process.destroy();  //结束进程
```
### 2.4. 界面绘制
本程序主要使用Swing框架进行界面的显示，其中三个模块所需要的组件包括JPanel, JFrame, JTable，其中对于利用率折线图的绘制需要使用Graphics2D类进行绘制。

在概述模块中，需要显示CPU的硬件信息和利用率、线程等参数信息，还需要根据获得的利用率进行折线图的绘制，对于折线图采用多变形的方法.drawPolyline()来绘制。绘制图形的程序代码如下：
```
//处理数据转为坐标  
for (int i = 0; i < _MAX_DATA_POINTS_; i++) {  
    int x = marginX + i * ((_WIDTH_ - 100) / (_MAX_DATA_POINTS_ - 1));  
    int y = (_HEIGHT_ / 2 - 20 - (int) cpuTotalData[i]);  
    //防止图像超出矩形范围    
    if (y < marginY) {  
        y = marginY;  
    }  
    xTotalPoints[i] = x;  
    yTotalPoints[i] = y;  
}
//绘制折线图
g2.drawPolyline(xTotalPoints, yTotalPoints, _MAX_DATA_POINTS_ + 2);
```
通过绘制多边矩形来实现折线图的效果，因此坐标需要多加两个顶点坐标。CPU模块类似，就不重复说明。对于进程模块，需要获取进程信息并显示进程表格。生成进程表格程序代码如下：

```
//创建表格
columns = new String[]{"名称", "PID", "会话名", "CPU", "内存使用"};  
model = new DefaultTableModel(processList, columns);  
table = new JTable(model);  
servicemodel = new DefaultTableModel(servicesList, columns);  
serviceTable = new JTable(servicemodel);  
consolemodel = new DefaultTableModel(consoleList, columns);  
consoleTable = new JTable(consolemodel);

//创建比较器，进行排序  
Comparator<String> customComparator = _createCustomComparator_();  
TableRowSorter<TableModel> sorter = new TableRowSorter<>(model);  
table.setRowSorter(sorter);
```
## 3. 系统实现
### 3.1. 概述页面
```
import com.sun.management.OperatingSystemMXBean;  
import oshi.SystemInfo;  
import oshi.hardware.CentralProcessor;  
import oshi.hardware.HardwareAbstractionLayer;  
import oshi.software.os.OperatingSystem;  
import oshi.util.FormatUtil;  
import javax.swing.*;  
import java.awt.*;  
import java.awt.event.ActionEvent;  
import java.awt.event.ActionListener;  
import java.lang.management.ManagementFactory;  
  
/**  
 * @ClassName : CPUMonitorOverview  //类名  
 * @Description : CPU参数监控概述  //描述  
 * @Author : ZoZou02 //作者  
 * @Date: 2024/3/2  9:45  
 */public class CPUMonitorOverview extends JPanel implements ActionListener {  
    private static final int WIDTH = 600;//窗口宽度  
    private static final int HEIGHT = 400;//窗口高度  
    private static final int MAX_DATA_POINTS = 100;//存储CPU数据数量  
    private final Timer timer;//计时器  
    OperatingSystemMXBean bean;     //JMX的操作系统信息  
    SystemInfo systemInfo;    //系统信息  
    HardwareAbstractionLayer hardware;    //硬件信息  
    CentralProcessor processor;    //CPU  
    OperatingSystem os;    //获取操作系统信息  
    int CPU_PHYSICAL_PROCESSOR;    //CPU物理内核  
    int CPU_LOGICAL_PROCESSOR;    //CPU逻辑处理器  
    int[][] xLoadsPoints; // 折线的顶点x坐标  
    int[][] yLoadsPoints; // 折线的顶点y坐标  
    double[] cpuTotalData;    //总CPU使用数据  
    int[] xTotalPoints; // 折线的顶点x坐标  
    int[] yTotalPoints; // 折线的顶点y坐标  
    int moveX = 0;//方格移动  
    //构造函数，计时器每秒刷新一次，与任务管理器一致  
    public CPUMonitorOverview() {  
        bean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean(); //获取操作系统的相关信息  
        systemInfo = new SystemInfo();    //获取系统信息  
         hardware = systemInfo.getHardware();    //获取硬件信息  
        processor = hardware.getProcessor();    //获取CPU  
        os = systemInfo.getOperatingSystem();    //获取操作系统信息  
        CPU_PHYSICAL_PROCESSOR = processor.getPhysicalProcessorCount();    //CPU物理内核  
        CPU_LOGICAL_PROCESSOR = processor.getLogicalProcessorCount();    //CPU逻辑处理器  
        xLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点x坐标  
        yLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
        xTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点x坐标（+2是为了存储底部两个顶点坐标，绘制的是多边形）  
        yTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
        cpuTotalData = new double[MAX_DATA_POINTS];  
        timer = new Timer(1000, this); // 1秒更新一次  
        timer.start();  
    }  
    // 创建绘图面板  
    @Override  
    public void paintComponent(Graphics g) {  
        super.paintComponent(g);  
        Graphics2D g2 = (Graphics2D) g;  
        int marginX = 30;  
        int marginY = 40;  
  
        //显示范围  
        int recWidth = WIDTH - 105;  
        int recHeight = HEIGHT / 2 - 60;  
        g2.setFont(new Font("微软雅黑", Font.BOLD, 14));//设置字体  
        //CPU总使用率  
        //填充矩形  
        g2.setColor(Color.black);  
        g2.fillRect(marginX, marginY, recWidth, recHeight);  
  
        // 获取坐标信息  
        for (int i = 0; i < MAX_DATA_POINTS; i++) {  
            int x = marginX + i * ((WIDTH - 100) / (MAX_DATA_POINTS - 1));  
            int y = (HEIGHT / 2 - 20 - (int) cpuTotalData[i]);  
            //防止图像超出矩形范围  
            if (y < marginY) {  
                y = marginY;  
            }  
            xTotalPoints[i] = x;  
            yTotalPoints[i] = y;  
  
            g2.setColor(Color.green);  
            // 显示使用率数据值  
            String dataPointStr = String.format("%.0f%%", cpuTotalData[MAX_DATA_POINTS - 1]);  
            g2.setColor(Color.black);  
            g2.drawString("CPU使用率: " + dataPointStr, marginX, marginY + 160);  
        }  
        // 填充  
        xTotalPoints[MAX_DATA_POINTS] = marginX + recWidth;  
        yTotalPoints[MAX_DATA_POINTS] = marginY + recHeight;  
        xTotalPoints[MAX_DATA_POINTS + 1] = marginX;  
        yTotalPoints[MAX_DATA_POINTS + 1] = marginY + recHeight;  
        g2.setColor(new Color(0, 98, 0));  
        g2.fillPolygon(xTotalPoints, yTotalPoints, MAX_DATA_POINTS + 2); // 通过填充部分顶点来填充折线的一边  
  
        //画方格  
        g2.setColor(new Color(5, 160, 8));  
        for (int i = 0; i < 10; i++) {  
            g2.drawLine(marginX, marginY + 14 * i, marginX + recWidth, marginY + 14 * i);  
        }  
        for (int i = 0; i < MAX_DATA_POINTS; i += 5) {  
            g2.drawLine(xTotalPoints[i] + 20 - moveX, marginY, xTotalPoints[i] + 20 - moveX, marginY + recHeight);  
        }  
        //画线  
        g2.setColor(Color.green);  
        g2.drawPolyline(xTotalPoints, yTotalPoints, MAX_DATA_POINTS + 2);  
  
        //显示cpu数据  
        g2.setColor(Color.black);  
        //显示CPU运行时间  
        String cpuTime = getCpuTime();  
        g2.drawString("正常运行时间：" + cpuTime, marginX, marginY + 180);  
  
        //显示进程数  
        String processCount = String.valueOf(os.getProcessCount());  
        g2.drawString("进程数：" + processCount, marginX, marginY + 200);  
  
        //显示线程数  
        String threadCount = String.valueOf(os.getThreadCount());  
        g2.drawString("线程数：" + threadCount, marginX, marginY + 220);  
  
        //操作系统显示  
        String osName = "OS：" + os;  
        g2.drawString(osName, marginX, 20);  
  
        //CPU型号显示  
        String cpuName = "CPU：" + hardware.getProcessor();  
        g2.drawString(cpuName, marginX, 35);  
  
        //CPU核数显示  
        String cpuPCores = "内核：" + hardware.getProcessor().getPhysicalProcessorCount();  
        g2.drawString(cpuPCores, 350, marginY + 160);  
        String cpuLCores = "逻辑处理器：" + hardware.getProcessor().getLogicalProcessorCount();  
        g2.drawString(cpuLCores, 350, marginY + 180);  
  
        //CPU频率显示（基准速度）  
        double freq = processor.getVendorFreq() * 0.000000001; // 将频率转换为GHz  
        String formattedFreq = String.format("基准速度：%.2fGHz", freq);  
        g2.drawString(formattedFreq, 350, marginY + 200);  
    }  
  
    //每秒新增信息  
    public void actionPerformed(ActionEvent e) {  
        //获取CPU使用率  
        for (int i = 0; i < MAX_DATA_POINTS - 1; i++) {  
            cpuTotalData[i] = cpuTotalData[i + 1];  
        }  
        cpuTotalData[MAX_DATA_POINTS - 1] = getCpuUsage();  
        //方格移动  
        if (moveX != 20) {  
            moveX += 5;  
        } else {  
            moveX = 0;  
        }  
        repaint();  
    }  
  
    //获取CPU使用率  
    private double getCpuUsage() {  
        return bean.getCpuLoad() * 100.0 * 2;   //乘于倍率  
    }  
  
    //获取CPU运行时间  
    private String getCpuTime() {  
        return FormatUtil.formatElapsedSecs(processor.getSystemUptime());  
    }  
}
```
通过调用oshi信息库的函数，实例化SystemInfo()类，可以直接获得系统信息，通过系统信息的getHardware()方法取硬件信息HardwareAbstractionLayer，最后就可以使用getProcessor()方法获得CPU信息。

在获取CPU利用率的时候选择了om.sun.management中的OperatingSystemMXBean接口，使用getCpuLoad()方法获取Cpu使用率，不使用oshi库中的方法是因为oshi库中获取的利用率的信息效率较低，且需要二次处理才能使用。
### 3.2. CPU页面
```
import com.sun.management.OperatingSystemMXBean;  
import oshi.SystemInfo;  
import oshi.hardware.CentralProcessor;  
import oshi.hardware.HardwareAbstractionLayer;  
import oshi.software.os.OperatingSystem;  
import javax.swing.*;  
import java.awt.*;  
import java.awt.event.ActionEvent;  
import java.awt.event.ActionListener;  
import java.lang.management.ManagementFactory;  
  
/**  
 * @ClassName : CPUMonitorList  //类名  
 * @Description : 每个CPU的数据获取和图表绘制  //描述  
 * @Author : ZoZou02 //作者  
 * @Date: 2024/3/4  15:00  
 */public class CPUMonitorList extends JPanel implements ActionListener {  
    private static final int WIDTH = 600;//窗口宽度  
    private static final int HEIGHT = 400;//窗口高度  
    private static final int MAX_DATA_POINTS = 100;//存储CPU数据数量  
    private final Timer timer;//计时器  
    private OperatingSystemMXBean bean;  
    private SystemInfo systemInfo;    //获取系统信息  
    private HardwareAbstractionLayer hardware;    //获取硬件信息  
    private CentralProcessor processor ;    //获取CPU  
    private int CPU_PHYSICAL_PROCESSOR;    //CPU物理内核  
    private int CPU_LOGICAL_PROCESSOR;    //CPU逻辑处理器  
    private int[][] xLoadsPoints; // 折线的顶点x坐标  
    private int[][] yLoadsPoints; // 折线的顶点y坐标  
    private OperatingSystem os;    //获取操作系统信息  
    private double[][] cpuLoads; //每个逻辑CPU使用率存储数组  
    private double[] cpuTotalData;    //总CPU使用数据  
    private int[] xTotalPoints; // 折线的顶点x坐标  
    private int[] yTotalPoints; // 折线的顶点y坐标  
    private int moveX = 0;//方格移动  
  
    //构造函数，计时器每秒刷新一次，与任务管理器一致  
    public CPUMonitorList() {  
        bean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();  
        systemInfo = new SystemInfo();    //获取系统信息  
        hardware = systemInfo.getHardware();    //获取硬件信息  
        processor = hardware.getProcessor();    //获取CPU  
        CPU_PHYSICAL_PROCESSOR = processor.getPhysicalProcessorCount();    //CPU物理内核  
        CPU_LOGICAL_PROCESSOR = processor.getLogicalProcessorCount();    //CPU逻辑处理器  
        xLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点x坐标  
        yLoadsPoints = new int[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
        os = systemInfo.getOperatingSystem();    //获取操作系统信息  
        xTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点x坐标  
        yTotalPoints = new int[MAX_DATA_POINTS + 2]; // 折线的顶点y坐标  
        cpuTotalData = new double[MAX_DATA_POINTS];  
        cpuLoads = new double[CPU_LOGICAL_PROCESSOR][MAX_DATA_POINTS];  
        timer = new Timer(1000, this); // 1秒更新一次  
        timer.start();  
    }  
  
    // 创建绘图面板  
    @Override  
    public void paintComponent(Graphics g) {  
        super.paintComponent(g);  
        Graphics2D g2 = (Graphics2D) g;  
        int marginX = 30;  
        int marginY = 40;  
        //显示范围  
        int recWidth = WIDTH - 105;  
        int recHeight = HEIGHT / 2 - 60;  
        g2.setFont(new Font("微软雅黑", Font.BOLD, 14));//设置字体  
        //CPU总使用率  
        //填充矩形  
        g2.setColor(Color.black);  
        g2.fillRect(marginX, marginY, recWidth, recHeight);  
  
        // 获取坐标信息  
        for (int i = 0; i < MAX_DATA_POINTS; i++) {  
            int x = marginX + i * ((recWidth) / (MAX_DATA_POINTS - 1));         //i在里面在外面会影响数据大小  
            int y = (HEIGHT / 2 - 20 - (int) cpuTotalData[i]);  
            //防止图像超出矩形范围  
            if (y < marginY) {  
                y = marginY;  
            }  
            xTotalPoints[i] = x;  
            yTotalPoints[i] = y;  
  
            g2.setColor(Color.green);  
            // 显示使用率数据值  
            String dataPointStr = String.format("%.0f%%", cpuTotalData[MAX_DATA_POINTS - 1]);  
            g2.setColor(Color.black);  
            g2.drawString("CPU - 总计使用率: " + dataPointStr, 40, 30);  
        }  
        // 填充  
        xTotalPoints[MAX_DATA_POINTS] = marginX + recWidth;  
        yTotalPoints[MAX_DATA_POINTS] = marginY + recHeight;  
        xTotalPoints[MAX_DATA_POINTS + 1] = marginX;  
        yTotalPoints[MAX_DATA_POINTS + 1] = marginY + recHeight;  
        g2.setColor(new Color(0, 98, 0));  
        g2.fillPolygon(xTotalPoints, yTotalPoints, MAX_DATA_POINTS + 2); // 通过填充部分顶点来填充折线的一边  
  
        //画方格  
        g2.setColor(new Color(5, 160, 8));  
        for (int i = 0; i < 10; i++) {  
            g2.drawLine(marginX, marginY + 14 * i, marginX + recWidth, marginY + 14 * i);  
        }  
        for (int i = 0; i < MAX_DATA_POINTS; i += 5) {  
            g2.drawLine(xTotalPoints[i] + 20 - moveX, marginY, xTotalPoints[i] + 20 - moveX, marginY + recHeight);  
        }  
  
        //画线  
        g2.setColor(Color.green);  
        g2.drawPolyline(xTotalPoints, yTotalPoints, MAX_DATA_POINTS + 2);  
  
        //其他逻辑处理器使用率  
        for (int i = 0; i < CPU_LOGICAL_PROCESSOR; i++) {  
            //填充黑色矩形  
            g2.setColor(Color.black);  
            g2.fillRect(marginX, marginY + 175 * (i + 1), recWidth, recHeight);    //i+1  给前面总的CPU使用率挪位置  
        }  
  
        // 绘制每个CPU的使用率折线图  
        g2.setColor(Color.green);  
        for (int i = 0; i < CPU_LOGICAL_PROCESSOR; i++) {  
            // 获取坐标信息  
            for (int j = 0; j < MAX_DATA_POINTS; j++) {  
                int x = marginX + j * (recWidth / (MAX_DATA_POINTS - 1));//i在里面在外面会影响数据大小  
                int y = (HEIGHT / 2 - 20 - (int) (cpuLoads[i][j] * HEIGHT / 2)) + 175 * (i + 1);  
  
                //防止图像超出矩形范围  
                if (y < marginY + 175 * (i + 1)) {  
                    y = marginY + 175 * (i + 1);  
                }  
                xLoadsPoints[i][j] = x;  
                yLoadsPoints[i][j] = y;  
                //显示使用率  
                String dataPointStr = String.format("%.0f%%", cpuLoads[i][MAX_DATA_POINTS - 1] * 100);  
                g2.setColor(Color.black);  
                g2.drawString("CPU " + i + " 使用率: " + dataPointStr, 40, 30 + 175 * (i + 1));  
            }  
        }  
  
        for (int i = 0; i < CPU_LOGICAL_PROCESSOR; i++) {  
            xLoadsPoints[i][MAX_DATA_POINTS] = marginX + recWidth;  
            yLoadsPoints[i][MAX_DATA_POINTS] = marginY + recHeight + 175 * (i + 1);  
            xLoadsPoints[i][MAX_DATA_POINTS + 1] = marginX;  
            yLoadsPoints[i][MAX_DATA_POINTS + 1] = marginY + recHeight + 175 * (i + 1);  
  
            //填充  
            g2.setColor(new Color(0, 98, 0));  
            g2.fillPolygon(xLoadsPoints[i], yLoadsPoints[i], MAX_DATA_POINTS + 2);  
            //画方格  
            g2.setColor(new Color(5, 160, 8));  
            for (int j = 0; j < 10; j++) {  
                g2.drawLine(marginX, marginY + 175 * (i + 1) + 14 * j, marginX + recWidth, marginY + 175 * (i + 1) + 14 * j);  
            }  
            for (int j = 0; j < MAX_DATA_POINTS; j += 5) {  
                g2.drawLine(xLoadsPoints[i][j] + 20 - moveX, marginY + 175 * (i + 1), xLoadsPoints[i][j] + 20 - moveX, marginY + 175 * (i + 1) + recHeight);  
            }  
            //画线  
            g2.setColor(Color.green);  
            g2.drawPolyline(xLoadsPoints[i], yLoadsPoints[i], MAX_DATA_POINTS + 2);  
        }  
    }  
  
    @Override  
    public Dimension getPreferredSize() {  
        return new Dimension(600, 3000); // 设置绘图区域的大小  
    }  
  
    //每秒新增信息  
    public void actionPerformed(ActionEvent e) {  
        //获取总CPU使用率  
        for (int i = 0; i < MAX_DATA_POINTS - 1; i++) {  
            cpuTotalData[i] = cpuTotalData[i + 1];  
        }  
        cpuTotalData[MAX_DATA_POINTS - 1] = getCpuUsage() * 2;             //乘于一个倍率  
  
        //分别获取每个逻辑处理器使用率  
        double[] load = processor.getProcessorCpuLoadBetweenTicks();  
        int flag = 0;  
        for (double avg : load) {  
            // 显示使用率数据值  
            for (int j = 0; j < MAX_DATA_POINTS - 1; j++) {  
                cpuLoads[flag][j] = cpuLoads[flag][j + 1];   //将之前的数据往前移动  
            }  
            cpuLoads[flag][MAX_DATA_POINTS - 1] = avg; //新数据放在数组末尾  
            flag++;  
        }  
        //方格移动  
        if (moveX != 20) {  
            moveX += 5;  
        } else {  
            moveX = 0;  
        }  
        repaint();  
    }  
  
    //获取CPU使用率  
    private double getCpuUsage() {  
        return bean.getCpuLoad() * 100.0;  
    }  
}
```
（与概述页面相似）
### 3.3. 进程页面
```
import javax.swing.*;  
import javax.swing.table.DefaultTableModel;  
import javax.swing.table.TableModel;  
import javax.swing.table.TableRowSorter;  
import java.awt.*;  
import java.awt.event.ActionEvent;  
import java.awt.event.ActionListener;  
import java.awt.event.KeyEvent;  
import java.io.BufferedReader;  
import java.io.IOException;  
import java.io.InputStreamReader;  
import java.util.Comparator;  
  
/**  
 * @ClassName : CPUProcessListTable  //类名  
 * @Description : 实时进程表格  //描述  
 * @Author : ZoZou02 //作者  
 * @Date: 2024/3/3  15:02  
 */public class CPUProcessListTable extends JPanel implements ActionListener {  
    private static final int MAX_DATA_POINTS = 400;//存储进程数量  
    private final Timer timer;//计时器  
    String[][] processList;//存储进程列表  
    String[][] servicesList;//存储服务列表  
    String[][] consoleList;//存储应用列表  
    String[] columns;//表头  
    private JTable table;  
    private DefaultTableModel model;  
    private JTable serviceTable;  
    private DefaultTableModel servicemodel;  
    private JTable consoleTable;  
    private DefaultTableModel consolemodel;  
    JPopupMenu m_popupMenu;   //右键菜单  
    int selectedRow;        //选中的行数  
    String selectedPid;       //选中进程的pid  
  
    //构造函数，计时器每秒刷新一次，与任务管理器一致  
    public CPUProcessListTable() {  
        setLayout(new BorderLayout());  
        processList = new String[MAX_DATA_POINTS][5];  
        servicesList = new String[MAX_DATA_POINTS][5];  
        consoleList = new String[MAX_DATA_POINTS][5];  
  
        columns = new String[]{"名称", "PID", "会话名", "CPU", "内存使用"};  
        model = new DefaultTableModel(processList, columns);  
        table = new JTable(model);  
  
        servicemodel = new DefaultTableModel(servicesList, columns);  
        serviceTable = new JTable(servicemodel);  
        consolemodel = new DefaultTableModel(consoleList, columns);  
        consoleTable = new JTable(consolemodel);  
  
        createPopupMenu();  
        Comparator<String> customComparator = createCustomComparator();  
  
        TableRowSorter<TableModel> sorter = new TableRowSorter<>(model);  
        TableRowSorter<TableModel> serviceSorter = new TableRowSorter<>(servicemodel);  
        TableRowSorter<TableModel> consoleSorter = new TableRowSorter<>(consolemodel);  
  
        sorter.setComparator(1,customComparator);  
        sorter.setComparator(4,customComparator);  
        serviceSorter.setComparator(1,customComparator);  
        serviceSorter.setComparator(4,customComparator);  
        consoleSorter.setComparator(1,customComparator);  
        consoleSorter.setComparator(4,customComparator);  
  
        table.setRowSorter(sorter);  
        serviceTable.setRowSorter(serviceSorter);  
        consoleTable.setRowSorter(consoleSorter);  
        //添加点击事件  
        table.addMouseListener(new java.awt.event.MouseAdapter() {  
            public void mouseClicked(java.awt.event.MouseEvent evt) {  
                MouseClicked(evt);  
            }  
        });  
  
        //添加表格组件  
        JScrollPane pane = new JScrollPane(table);  
        pane.getVerticalScrollBar().setBlockIncrement(64);  
        pane.getVerticalScrollBar().setUnitIncrement(16);  
  
        JScrollPane servicePane = new JScrollPane(serviceTable);  
        servicePane.getVerticalScrollBar().setBlockIncrement(64);  
        servicePane.getVerticalScrollBar().setUnitIncrement(16);  
  
        JScrollPane consolePane = new JScrollPane(consoleTable);  
        consolePane.getVerticalScrollBar().setBlockIncrement(64);  
        consolePane.getVerticalScrollBar().setUnitIncrement(16);  
  
        JTabbedPane tabbedPane = new JTabbedPane();  
        tabbedPane.addTab("总进程", pane);  
        tabbedPane.setMnemonicAt(0, KeyEvent.VK_1);  
        tabbedPane.addTab("服务进程", servicePane);  
        tabbedPane.setMnemonicAt(1, KeyEvent.VK_2);  
        tabbedPane.addTab("应用进程", consolePane);  
        tabbedPane.setMnemonicAt(1, KeyEvent.VK_3);  
        add(tabbedPane, BorderLayout.CENTER);  
  
        timer = new Timer(1000, this); // 1秒更新一次  
        timer.start();  
    }  
  
    @Override  
    public void setPreferredSize(Dimension preferredSize) {  
        super.setPreferredSize(preferredSize);  
    }  
  
    //每秒新增信息  
    public void actionPerformed(ActionEvent e) {  
        selectedRow = table.getSelectedRow();//选中的行  
        if (selectedRow != -1) {  
            Object o = table.getModel().getValueAt(selectedRow,1);  
            selectedPid = o.toString().replaceAll("\\s", "");  
        }  
  
        //获取进程信息  
        try {  
            ProcessBuilder processBuilder = new ProcessBuilder("tasklist");  
            Process process = processBuilder.start();  
  
            // 读取命令输出  
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));  
            String line;  
            //清空列表  
            model.setRowCount(0);  
            servicemodel.setRowCount(0);  
            consolemodel.setRowCount(0);  
  
            for (int i = 0; i < MAX_DATA_POINTS; i++) {  
                line = reader.readLine();  
                if (line != null && i >= 3) {                    //前三行没有实际数据  
                    processList[i - 3][0] = line.substring(0, 24);       //名称  
                    processList[i - 3][1] = line.substring(26, 34);      //PID  
                    processList[i - 3][2] = line.substring(35, 43);      //会话  
                    processList[i - 3][3] = line.substring(62, 63);      //CPU  
                    processList[i - 3][4] = line.substring(63, 76);       //内存占用  
                    model.addRow(processList[i - 3]);                    //将读取到的添加进table  
  
                    if (line.substring(35, 43).replaceAll("\\s", "").equals("Console")) {  
                        consolemodel.addRow(processList[i - 3]);  
                    } else {  
                        servicemodel.addRow(processList[i - 3]);  
                    }  
                }  
            }  
            process.destroy();                     //结束命令行进程  
        } catch (IOException exception) {  
            exception.printStackTrace();  
        }  
        updatePanelSize();  
        // 重新绘制表格  
        revalidate();  
        repaint();  
    }  
    //点击事件  
    private void MouseClicked(java.awt.event.MouseEvent evt) {  
        mouseRightButtonClick(evt);  
    }  
  
    //鼠标右键点击事件  
    private void mouseRightButtonClick(java.awt.event.MouseEvent evt) {  
        //判断是否为鼠标的BUTTON3按钮，BUTTON3为鼠标右键  
        if (evt.getButton() == java.awt.event.MouseEvent.BUTTON3) {  
            //通过点击位置找到点击为表格中的行  
            int focusedRowIndex = table.rowAtPoint(evt.getPoint());  
            if (focusedRowIndex == -1) {  
                return;  
            }  
            //将表格所选项设为当前右键点击的行  
            table.setRowSelectionInterval(focusedRowIndex, focusedRowIndex);  
            //弹出菜单  
            m_popupMenu.show(table, evt.getX(), evt.getY());  
        }  
  
    }  
  
    //排序比较器  
    private static Comparator<String> createCustomComparator() {  
        return new Comparator<String>() {  
            @Override  
            public int compare(String o1, String o2) {  
                try {  
                    Double d1 = Double.parseDouble(o1.replaceAll("[,\\sK]", ""));  
                    Double d2 = Double.parseDouble(o2.replaceAll("[,\\sK]", ""));  
                    return d1.compareTo(d2);  
                } catch (NumberFormatException e) {  
                    return 0; // 如果转换出错则返回0  
                }  
            }  
        };  
    }  
  
    //创建一个JPopupMenu()  
    private void createPopupMenu() {  
        m_popupMenu = new JPopupMenu();  
        JMenuItem delMenItem = new JMenuItem();  
        delMenItem.setText("  结束进程  ");  
        delMenItem.addActionListener(new java.awt.event.ActionListener() {  
            public void actionPerformed(java.awt.event.ActionEvent evt) {  
                //该操作需要做的事  
                try {  
                    killProcessByPid(selectedPid);  
                } catch (Exception e) {  
                    throw new RuntimeException(e);  
                }  
            }  
        });  
        m_popupMenu.add(delMenItem);  
    }  
  
    // 根据Pid将进程干掉  
    public static void killProcessByPid(String pid) throws Exception {  
        Runtime.getRuntime().exec("taskkill /F /PID " + pid);  
    }  
  
    //更新Panel大小(无)  
    private void updatePanelSize() {  
        setPreferredSize(new Dimension(580, 200));  
        revalidate();  
    }  
}
```
这里获取进程信息使用了命令行tasklist获取，使用oshi实时获取进程信息占用过高，运行速度极低。
### 3.4. 主函数

```
import javax.swing.*;  
import java.awt.*;  
import java.awt.event.KeyEvent;  
  
/**  
 * @ClassName : CPUMainPanel  //类名  
 * @Description : 主函数  //描述  
 * @Author : ZoZou02 //作者  
 * @Date: 2024/3/1  15:02  
 */public class CPUMainPanel extends JPanel {  
    public CPUMainPanel() {  
        super(new GridLayout(1, 1));  
        JTabbedPane tabbedPane = new JTabbedPane();  
        //概述容器  
        JPanel panel = new JPanel();  
        //CPU概述  
        JComponent overviewpPanel = new CPUMonitorOverview();  
        overviewpPanel.setBorder(BorderFactory.createEtchedBorder());  
        //CPU列表  
        JComponent cpuListPanel = new CPUMonitorList();  
        JScrollPane scrollPane1 = new JScrollPane(  
                cpuListPanel,  
                ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS,  
                ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER  
        );  
        //增加滚动速度  
        scrollPane1.getVerticalScrollBar().setBlockIncrement(64);  
        scrollPane1.getVerticalScrollBar().setUnitIncrement(16);  
        //进程概述表格  
        JComponent cpuProcessListTable = new CPUProcessListTable();  
        cpuProcessListTable.setPreferredSize(new Dimension(580, 200));  
        overviewpPanel.setPreferredSize(new Dimension(600, 300));  
        panel.add(overviewpPanel);  
        panel.add(cpuProcessListTable);  
        tabbedPane.addTab("概述", panel);  
        tabbedPane.setMnemonicAt(0, KeyEvent.VK_1);  
        tabbedPane.addTab("CPU", scrollPane1);  
        tabbedPane.setMnemonicAt(1, KeyEvent.VK_2);  
        add(tabbedPane);  
    }  
  
    public static void main(String[] args) {  
        JFrame frame = new JFrame("CPU实时监测");  
        ImageIcon icon=new ImageIcon("icon/icon.png");  
        frame.setIconImage(icon.getImage());  
        frame.setSize(600, 600);  
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);  
        frame.add(new CPUMainPanel());  
        frame.setVisible(true);  
    }  
}
```
## 4. 效果展示
### 4.1. 概述页面
概述页面实现了CPU硬件信息的显示，并且实时更新了CPU的使用率、线程等参数信息，绘制了动态的CPU利用率折线图。窗口布局将进程页面与概述页面进行了整合，其余页面通过JtabledPane进行切换。
![[Pasted image 20240607102047.png]]
### 4.2. CPU页面
![[Pasted image 20240607102056.png]]
![[Pasted image 20240607102109.png]]
### 4.3. 进程页面
进程列表将进程的名称、Pid等信息，通过点击表头进行进程的排序，点击一次为从小到大排序，再次点击则变为从大到小排序。右键选择点击进程，会弹出“结束进程”菜单，点击“结束进程”则会将选中的当前进程结束（但是由于进程每秒会进行刷新，选中会比较困难，但其实每次点击右键弹出“结束进程”的时候已经获取了之前所选中的进程了，懒得解决这个问题了哈哈哈）。
![[Pasted image 20240607102521.png]]
## 5. 源代码获取
github:
gitee: