## 1. 今日任务看板
### 1.1. 明天就到期任务
```tasks
not done
path includes 日记
due before <% tp.date.tomorrow("YYYY-MM-DD") %>
```

### 1.2. 今天需要干的
```tasks
not done
path includes 日记
due on <% tp.date.now("YYYY-MM-DD") %>
```

### 1.3. 未来两周
```tasks
not done
path includes 日记
due after <% tp.date.now("YYYY-MM-DD") %>
due before <% tp.date.now("YYYY-MM-DD", +14) %>
```

### 1.4. 没有设置日期的
```tasks
not done
path includes 日记
no due date
```

### 1.5. 今天已完成的
```tasks
path includes 日记
done on <% tp.date.now("YYYY-MM-DD") %>
```
