## 1. 今日任务看板
### 1.1. 今天之前就到期任务
```tasks
not done
due before <% tp.date.now("YYYY-MM-DD") %>
```

### 1.2. 今天需要干的
```tasks
not done
due on {{tp_date:YYYY-MM-DD}}
```

### 1.3. 未来两周
```tasks
not done
due after {{tp_date:YYYY-MM-DD}}
due before {{tp_date+14d:YYYY-MM-DD}}
```

### 1.4. 没有设置日期的
```tasks
not done
no due date
```

### 1.5. 今天已完成的
```tasks
done on {{tp_date:YYYY-MM-DD}}
```
