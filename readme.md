# 羽毛球场管理系统

## 功能块
- 预定场地
- 取消预定场地
- 预览收入汇总
- 优惠（option）

## 程序设计
![UML](https://github.com/313183373/codingWithHer/blob/master/UML.png)
### 输入解析模块（InputDecoder）
![InputDecoder](https://github.com/313183373/codingWithHer/blob/master/inputDecoder.png)
- decodeInput
    - 输入字符串split后长度检测，如有问题，抛出异常
        - book：应该是4
        - cancel：应该是5
    - 输入字符串时间段检测，如有问题，抛出异常
        - 是否有起始终止
        - 起始是否小于终止
    - 输入字符串的日期检测，如有问题，抛出异常
    - 输入字符串的场地是否合法，如有问题，抛出异常

### 预定/取消模块（BadmintonManager）
![BadmintonManager](https://github.com/313183373/codingWithHer/blob/master/BadmintonManager.png)
- book
    - 冲突检测和合法时间段检测，如有问题，抛出异常
    - 为用户添加一条预定信息
    - 为场地schedule添加一条预定信息
    - 为场地record添加一条预定信息
- cancel
    - 用户是否存在检测和订单是否存在检测，如有问题，抛出异常
    - 删除用户的相应预定信息
    - 删除场地schedule的相应预定信息
    - 为场地record添加一条取消信息

### 预览收入汇总（PrintManager）
- printIncome
    - 打印抬头
    - 遍历每个场地流水信息，拼接、排序并打印
    - 打印结尾

### 用户管理（UserManager）
- hasBooked
    - 用户是否曾预定过
- addUser
    - 添加用户
- getUser
    - 根据uid获得用户

