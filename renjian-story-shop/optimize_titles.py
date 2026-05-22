# -*- coding: utf-8 -*-
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STORIES_PATH = os.path.join(SCRIPT_DIR, 'stories.json')

with open(STORIES_PATH, 'r', encoding='utf-8') as f:
    stories = json.load(f)

# 优化后的标题和开头段落
optimized_titles = {
    1: {
        "title": "开学第一周迷路指南：教学楼方向怎么记",
        "summary": "刚开学时怕走错教学楼是常态，大家都在用手机地图。适应校园的关键是先把食堂、宿舍、教学楼和快递点走熟，开学第一周不用急着赶课，先熟悉环境更重要。"
    },
    2: {
        "title": "宿舍夜聊生存手册：从'你睡了吗'开始",
        "summary": "宿舍夜聊从作业聊到未来和压力，是校园故事的真实来源。但夜聊也要有规矩，早八日要克制，宿舍相处的核心是互相让一步，比讲大道理管用得多。"
    },
    3: {
        "title": "考试周复习攻略：图书馆座位争夺战",
        "summary": "考试周图书馆座位紧张，但熬夜不等于努力。考前两周开始整理提纲，复习时先看目录标重点，考前作息建议早睡早起，比通宵效果更好。"
    },
    4: {
        "title": "第一次上台汇报：手抖星人自救指南",
        "summary": "第一次上台紧张是正常的，展示不是表演完美。PPT技巧是每页只写一个核心点，克服紧张的方法是从结论开始讲，而不是从背景铺垫。"
    },
    5: {
        "title": "社团招新避坑指南：选社团不是越多越好",
        "summary": "社团招新现场很热闹，但最后只留一个社团就够了。选社团和选课一样，不是越多越好，能坚持下来的才有意义，坚持比报名更重要。"
    },
    6: {
        "title": "食堂窗口选择困难症：排队时怎么快速决定",
        "summary": "食堂排队时纠结是常态，实用方法是先观察队伍再选窗口。接受随机命运，别纠结太久，食堂经验是一顿一顿试出来的。"
    },
    7: {
        "title": "运动会记忆碎片：不上场也有参与感",
        "summary": "运动会不只是跑道上的人，看台递水也是参与。集体感来自具体的小事，被推着走的感觉比名次重要，毕业后聊的都是那些乱七八糟的小事。"
    },
    8: {
        "title": "晚自习后的路灯时光：校园里的放松时刻",
        "summary": "晚自习后的路灯下是安静时刻，路上的小事最容易记住。那段路是每天最放松的十分钟，人需要一点什么都不做的时间。"
    },
    9: {
        "title": "小组作业沟通指南：分工明确才能推进",
        "summary": "小组作业分工时才发现时间不一样，这是训练推进能力的机会。分工要明确谁做什么、什么时候交，避免等待的方法是第一天就搭好框架。"
    },
    10: {
        "title": "毕业照那天：大家突然都很会道别",
        "summary": "毕业季平时随意的人也开始整理衣领，拍照是为了留住时间。真正舍不得的是没认真告别的日子，毕业照记录的是和谁一起笑过。"
    },
    11: {
        "title": "校园卡丢失应急指南：补卡流程全攻略",
        "summary": "丢校园卡后才发现吃饭、开门、洗澡、借书全靠它。预防措施是在卡套里塞纸条写手机号，养成出门前摸口袋的习惯。"
    },
    12: {
        "title": "打印店排队生存指南：提前一天打印",
        "summary": "截止日前的打印店是拖延检测器，格式错误比排队更折磨人。实用建议是提前一天打印，老板比你更了解学生的拖延程度。"
    },
    13: {
        "title": "抢课大战攻略：网速和手速哪个更重要",
        "summary": "抢课前五分钟宿舍突然安静，校园网卡住是最常见的抱怨。备选方案比第一志愿更重要，抢课技巧是提前列好备选，犹豫几秒名额可能就没了。"
    },
    14: {
        "title": "查寝前十分钟：宿舍整理效率巅峰时刻",
        "summary": "查寝通知等于加速模式启动，十分钟的效率是平时三倍。大家互相提醒别忘阳台，长期建议是平时保持基本整洁，不用每次都像打仗。"
    },
    15: {
        "title": "校园网断网应急方案：学习计划不断线",
        "summary": "校园网反复掉线是常态，整层楼都在问网还能不能用。应对方法是重要资料提前下载，备选方案包括囤流量包、去图书馆蹭网或看纸质资料。"
    }
}

# 更新 stories.json
updated_count = 0
for story in stories:
    story_id = story['id']
    if story_id in optimized_titles:
        story['title'] = optimized_titles[story_id]['title']
        story['summary'] = optimized_titles[story_id]['summary']
        updated_count += 1

# 保存更新后的文件
with open(STORIES_PATH, 'w', encoding='utf-8') as f:
    json.dump(stories, f, ensure_ascii=False, indent=2)

print(f"标题和开头段落优化完成！已更新 {updated_count} 篇文章")
print()
print("优化示例：")
print("=" * 60)
for story_id, data in list(optimized_titles.items())[:5]:
    print(f"ID {story_id}: {data['title']}")
    print(f"  摘要: {data['summary'][:60]}...")
    print()
