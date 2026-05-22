# -*- coding: utf-8 -*-
import json

# 读取 stories.json
with open('d:/fenxxiang/renjian-story-shop/stories.json', 'r', encoding='utf-8') as f:
    stories = json.load(f)

# 需要修改的内容
fixes = {
    5: {
        # 四六级
        "old": "报名时间一般在 3 到 4 月和 9 到 10 月",
        "new": "报名时间通常在考试前 2-3 个月，具体以各高校教务处通知为准"
    },
    6: {
        # 论文
        "old": "很多高校的查重率要求在 15% 到 30% 以下",
        "new": "各高校对查重率的要求不同，一般在 15%-30% 之间，具体以本校规定为准"
    },
    8: {
        # 考研
        "old": "9 月 28 日左右在推免系统填报志愿",
        "new": "9 月下旬在推免系统填报志愿，具体时间以研招网公告为准"
    },
    13: {
        # 考证
        "old": "初级会计职称在全国会计资格评价网报名，每年 11 月报名、次年 5 月考试",
        "new": "初级会计职称报名时间和考试时间以财政部会计资格评价中心公告为准"
    },
    14: {
        # 学生优惠
        "old": "每年 7 到 9 月的返校季活动力度最大，通常还会额外赠送 AirPods 或 Apple Pencil",
        "new": "苹果返校季活动通常在夏季举行，具体优惠以苹果官网公告为准"
    },
    20: {
        # 薪资
        "old": "个人缴纳比例大约是：养老保险 8%、医疗保险 2%、失业保险 0.5%、公积金 5% 到 12%",
        "new": "五险一金缴纳比例因地区而异，具体以当地社保局和公积金中心规定为准"
    },
    21: {
        # 三方协议
        "old": "违约金金额是否合理（通常在 3000 到 5000 元）",
        "new": "违约金金额是否合理"
    },
    30: {
        # 火车票
        "old": "硬座（含硬卧上铺）享受半价，动车组和高铁二等座享受公布票价的 75% 折扣",
        "new": "学生票优惠以 12306 官网最新政策为准"
    }
}

# 执行修改
updated_count = 0
for story in stories:
    story_id = story['id']
    if story_id in fixes:
        fix = fixes[story_id]
        # 修改 content
        for i, para in enumerate(story.get('content', [])):
            if fix['old'] in para:
                story['content'][i] = para.replace(fix['old'], fix['new'])
                updated_count += 1
                print(f"ID {story_id}: 已修改")
                break

# 保存修改后的文件
with open('d:/fenxxiang/renjian-story-shop/stories.json', 'w', encoding='utf-8') as f:
    json.dump(stories, f, ensure_ascii=False, indent=2)

print(f"\n共修改 {updated_count} 处")
