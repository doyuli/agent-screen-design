import type { MaterialDefinition } from '~~/shared/schema/material'
import { AreaChartIcon, BarChartIcon, LineChartIcon, PieChartIcon } from '@lucide/vue'

export const areaChartMaterialSchema: MaterialDefinition = {
  name: '面积图',
  group: 'charts',
  icon: AreaChartIcon,
  schema: {
    type: 'area-chart',
    name: '面积图',
    description: '图表',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
      lockRatio: false,
    },
    props: {
      option: {
        legend: {
          top: 38,
          left: 'center',
          itemWidth: 12,
          itemHeight: 8,
          show: true,
          textStyle: {
            color: '#cbd5e1',
          },
        },
        title: {
          text: '成交额趋势',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        dataset: {
          source: [
            { date: '周一', revenue: 120 },
            { date: '周二', revenue: 200 },
            { date: '周三', revenue: 150 },
            { date: '周四', revenue: 260 },
            { date: '周五', revenue: 330 },
            { date: '周六', revenue: 420 },
            { date: '周日', revenue: 510 },
          ],
        },
        grid: {
          top: 86,
          right: 24,
          bottom: 32,
          left: 48,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#64748b',
            },
          },
          axisLabel: {
            color: '#cbd5e1',
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#cbd5e1',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(148, 163, 184, 0.18)',
            },
          },
        },
        series: [
          {
            name: '成交额',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            encode: {
              x: 'date',
              y: 'revenue',
            },
            lineStyle: {
              width: 3,
              color: '#22d3ee',
            },
            itemStyle: {
              color: '#22d3ee',
            },
            areaStyle: {
              color: 'rgba(34, 211, 238, 0.25)',
            },
          },
        ],
      },
    },
  },
}

export const barChartMaterialSchema: MaterialDefinition = {
  name: '柱状图',
  group: 'charts',
  icon: BarChartIcon,
  schema: {
    type: 'bar-chart',
    name: '柱状图',
    description: '图表',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
      lockRatio: false,
    },
    props: {
      option: {
        legend: {
          top: 38,
          left: 'center',
          itemWidth: 12,
          itemHeight: 8,
          show: true,
          textStyle: {
            color: '#cbd5e1',
          },
        },
        title: {
          text: '销售额统计',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        tooltip: {},
        dataset: {
          source: [
            { month: '一月', sales: 120 },
            { month: '二月', sales: 200 },
            { month: '三月', sales: 150 },
            { month: '四月', sales: 80 },
            { month: '五月', sales: 170 },
            { month: '六月', sales: 240 },
          ],
        },
        grid: {
          top: 86,
          right: 24,
          bottom: 32,
          left: 48,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#64748b',
            },
          },
          axisLabel: {
            color: '#cbd5e1',
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#cbd5e1',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(148, 163, 184, 0.18)',
            },
          },
        },
        series: [
          {
            name: '销售额',
            type: 'bar',
            barWidth: '45%',
            encode: {
              x: 'month',
              y: 'sales',
            },
            itemStyle: {
              color: '#22d3ee',
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
      },
    },
  },
}

export const lineChartMaterialSchema: MaterialDefinition = {
  name: '折线图',
  group: 'charts',
  icon: LineChartIcon,
  schema: {
    type: 'line-chart',
    name: '折线图',
    description: '图表',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
      lockRatio: false,
    },
    props: {
      option: {
        legend: {
          top: 38,
          left: 'center',
          itemWidth: 12,
          itemHeight: 8,
          show: true,
          textStyle: {
            color: '#cbd5e1',
          },
        },
        title: {
          text: '访问量趋势',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        dataset: {
          source: [
            { date: '周一', visits: 820 },
            { date: '周二', visits: 932 },
            { date: '周三', visits: 901 },
            { date: '周四', visits: 934 },
            { date: '周五', visits: 1290 },
            { date: '周六', visits: 1330 },
            { date: '周日', visits: 1320 },
          ],
        },
        grid: {
          top: 86,
          right: 24,
          bottom: 32,
          left: 48,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#64748b',
            },
          },
          axisLabel: {
            color: '#cbd5e1',
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#cbd5e1',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(148, 163, 184, 0.18)',
            },
          },
        },
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            symbolSize: 8,
            encode: {
              x: 'date',
              y: 'visits',
            },
            lineStyle: {
              width: 3,
              color: '#38bdf8',
            },
            itemStyle: {
              color: '#38bdf8',
            },
          },
        ],
      },
    },
  },
}

export const pieChartMaterialSchema: MaterialDefinition = {
  name: '饼图',
  group: 'charts',
  icon: PieChartIcon,
  schema: {
    type: 'pie-chart',
    name: '饼图',
    description: '图表',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
      lockRatio: false,
    },
    props: {
      option: {
        color: ['#22d3ee', '#a78bfa', '#f59e0b', '#34d399', '#fb7185'],
        legend: {
          top: 38,
          left: 'center',
          itemWidth: 12,
          itemHeight: 8,
          show: true,
          textStyle: {
            color: '#cbd5e1',
          },
        },
        title: {
          text: '访问来源占比',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'item',
        },
        dataset: {
          source: [
            { channel: '搜索引擎', value: 1048 },
            { channel: '直接访问', value: 735 },
            { channel: '联盟广告', value: 484 },
            { channel: '视频广告', value: 300 },
          ],
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            center: ['50%', '62%'],
            avoidLabelOverlap: true,
            label: {
              color: '#e2e8f0',
            },
            labelLine: {
              lineStyle: {
                color: '#94a3b8',
              },
            },
            encode: {
              itemName: 'channel',
              value: 'value',
            },
          },
        ],
      },
    },
  },
}
