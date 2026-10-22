#!/usr/bin/env python3
"""Xuất dữ liệu bản đồ thành docs/assets/js/data/geo-world.js và geo-vn.js. Chạy: python3 tools/geo/export_geo.py"""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import vn_data as V, world_data as W
OUT = os.path.join(HERE, '..', '..', 'docs', 'assets', 'js', 'data')
r = lambda ring: [[round(x, 2), round(y, 2)] for x, y in ring]
J = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))
hdr = "/* Dữ liệu bản đồ số hóa thủ công (WGS84, [kinh độ, vĩ độ]) – độ chính xác khoảng 0,1–0,3° (Việt Nam) và 0,5–3° (thế giới). Chỉ dùng để minh họa học tập. */\n"
land = [{'name': k, 'ring': r(v)} for k, v in W.LAND.items()]
lakes = [{'name': k, 'ring': r(v)} for k, v in W.LAKES.items()]
open(os.path.join(OUT, 'geo-world.js'), 'w', encoding='utf-8').write(
    hdr + "(function(){var D=(window.DD=window.DD||{});D.geo=D.geo||{};D.geo.land=" + J(land) + ";D.geo.lakes=" + J(lakes) + ";})();\n")
vn = {
 'window': V.WINDOW,
 'region': [{'name': 'Đất liền châu Á', 'ring': r(V.ASIA_RING)}],
 'vietnam': {'ring': r(V.VN_RING)},
 'borders': {'cn': r(V.BORDER_CN), 'la': r(V.BORDER_LA), 'kh': r(V.BORDER_KH)},
 'islands': [{'name': n, 'ring': r(g)} for n, g in V.ISLANDS.items()] + [{'name': n, 'point': [x, y]} for n, x, y in V.POINT_ISLANDS],
 'archipelagos': [dict(id=a['id'], name=a['name'], bbox=a['bbox'], points=[[x, y] for x, y in a['points']]) for a in (V.HOANG_SA, V.TRUONG_SA)],
 'rivers': [{'name': n, 'line': r(l)} for n, l in V.RIVERS],
 'mountains': [{'name': n, 'lonlat': [x, y], 'elev': e, 'note': t} for n, x, y, e, t in V.MOUNTAINS],
 'plateaus': [{'name': n, 'lonlat': [x, y]} for n, x, y in V.PLATEAUS],
 'cities': [{'name': n, 'lonlat': [x, y], 'role': t} for n, x, y, t in V.CITIES] + [{'name': V.DAKDOA[0], 'lonlat': [V.DAKDOA[1], V.DAKDOA[2]], 'role': 'Nơi đặt Trường THCS Đak Đoa', 'school': True}],
 'extremes': [{'id': i, 'name': n, 'lonlat': [x, y], 'desc': d} for i, n, x, y, d in V.EXTREMES],
 'seas': [{'name': n, 'lonlat': [x, y]} for n, x, y in V.SEAS],
}
open(os.path.join(OUT, 'geo-vn.js'), 'w', encoding='utf-8').write(
    hdr + "(function(){var D=(window.DD=window.DD||{});D.geo=D.geo||{};D.geo.vn=" + J(vn) + ";})();\n")
for f in ('geo-world.js', 'geo-vn.js'): print(f, os.path.getsize(os.path.join(OUT, f)), 'bytes')
