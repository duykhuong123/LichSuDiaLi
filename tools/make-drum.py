#!/usr/bin/env python3
"""Sinh hoa văn mặt trống đồng Đông Sơn (cách điệu, lấy cảm hứng từ trống Ngọc Lũ) -> SVG tĩnh.
Đặc trưng được giữ: ngôi sao 14 tia ở tâm, các vành hoa văn đồng tâm (răng cưa, vòng tròn có chấm giữa,
hình học chữ V), vành người hóa trang lông chim, vành chim Lạc bay NGƯỢC chiều kim đồng hồ."""
import math, sys
C = 100
GOLD = '#f0cf7a'; GOLD2 = '#d9a93c'; DARK = '#1b1208'; BRONZE = '#3a2710'; BRONZE2 = '#5b3f17'
out = []
a = out.append
def pol(r, deg):  # 0 = đỉnh, tăng theo chiều kim đồng hồ
    t = math.radians(deg); return C + r*math.sin(t), C - r*math.cos(t)

a('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Hoa văn mặt trống đồng Đông Sơn (cách điệu)">')
a('<defs>'
  f'<radialGradient id="face" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#6a4a1a"/><stop offset=".65" stop-color="{BRONZE2}"/><stop offset="1" stop-color="{BRONZE}"/></radialGradient>'
  '<linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".45" stop-color="#c8932c"/><stop offset=".7" stop-color="#8a5f17"/><stop offset="1" stop-color="#f5d98a"/></linearGradient>'
  f'<g id="bird" fill="{GOLD}" stroke="none">'
  '<path d="M-9,0.5 Q-3,-3.6 5,-2.4 Q9,-2 10.5,-4.8 Q11.6,-7.2 14.5,-7.4 L25,-6.2 L15,-4.2 Q13.5,-3 13,-0.4 Q10,3 3,3.2 Q-4,3.6 -9,0.5Z"/>'
  '<path d="M-1,-2.6 Q-1.5,-9 -7,-12.6 Q-4.2,-12 -1.2,-9.8 Q-3,-7.2 0.8,-3.6Z"/>'
  '<path d="M1.8,-2.8 Q2.5,-8.6 -1.8,-13.4 Q1.8,-12.4 4.4,-8.6 Q4,-5.6 4.6,-2.8Z" opacity=".9"/>'
  '<path d="M-9,0.2 L-16.5,-3.2 L-14,-0.6 L-17.2,0.4 L-14,1.6 L-16.5,3.8 L-9.4,2Z"/>'
  '<path d="M-3,2.8 L-11,6.6 L-12.4,6 L-5,2.4Z"/><path d="M-1,3 L-8,9 L-9.4,8.4 L-2.6,2.6Z"/>'
  f'<circle cx="12.4" cy="-5.3" r=".8" fill="{DARK}"/></g>'
  f'<g id="dancer" fill="{GOLD}">'
  '<circle cx="0" cy="-8.2" r="1.5"/>'
  f'<path d="M-3.3,-9.6 L-2.4,-13.2 M-1.6,-10 L-1.1,-14 M0,-10.2 L0,-14.6 M1.6,-10 L1.1,-14 M3.3,-9.6 L2.4,-13.2" stroke="{GOLD}" stroke-width=".7" stroke-linecap="round" fill="none"/>'
  '<path d="M-1,-6.6 L1,-6.6 L1.4,-0.6 L-1.4,-0.6Z"/>'
  f'<path d="M-1,-6 L-5.2,-8.6 M1,-6 L5.2,-8.6" stroke="{GOLD}" stroke-width=".9" stroke-linecap="round" fill="none"/>'
  '<path d="M-1.4,-0.8 L-4.6,5.4 L-2,5 L-.5,2.4 L0,6.4 L.5,2.4 L2,5 L4.6,5.4 L1.4,-0.8Z"/>'
  f'<path d="M-1,5 L-2.2,8.2 M1,5 L2.2,8.2" stroke="{GOLD}" stroke-width=".9" stroke-linecap="round" fill="none"/></g>'
  '</defs>')

a(f'<circle cx="{C}" cy="{C}" r="99" fill="url(#rim)"/>')
a(f'<circle cx="{C}" cy="{C}" r="96.2" fill="{DARK}"/>')
a(f'<circle cx="{C}" cy="{C}" r="95" fill="url(#face)"/>')
def ring(r, w=.7, col=GOLD):
    a(f'<circle cx="{C}" cy="{C}" r="{r}" fill="none" stroke="{col}" stroke-width="{w}"/>')

def zig(r_out, r_in, n, fill=True, col=GOLD, w=.6, op=.95):
    pts = []
    for i in range(n):
        p1 = pol(r_out, i*360/n); p2 = pol(r_in, (i+.5)*360/n); p3 = pol(r_out, (i+1)*360/n)
        pts.append(f'M{p1[0]:.2f},{p1[1]:.2f} L{p2[0]:.2f},{p2[1]:.2f} L{p3[0]:.2f},{p3[1]:.2f}' + ('Z' if fill else ''))
    if fill: a(f'<path d="{" ".join(pts)}" fill="{col}" opacity="{op}"/>')
    else: a(f'<path d="{" ".join(pts)}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"/>')

ring(94, .8); zig(94, 89.4, 80); ring(88.4); ring(87.2, 1.4)
rr = 83.4; n = 96
for i in range(n):
    x, y = pol(rr, i*360/n)
    a(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="2.1" fill="none" stroke="{GOLD}" stroke-width=".55"/><circle cx="{x:.2f}" cy="{y:.2f}" r=".55" fill="{GOLD}"/>')
ring(rr+2.1, .4); ring(rr-2.1, .4); ring(79.4, 1.2); ring(78.2, .6)
# vành chim Lạc: bay ngược chiều kim đồng hồ (tại đỉnh chim quay đầu sang trái)
nb = 18; rb = 70.2
for i in range(nb):
    a(f'<g transform="rotate({i*360/nb:.2f} {C} {C}) translate({C} {C-rb}) scale(-.74 .74)"><use href="#bird"/></g>')
for i in range(nb):
    x, y = pol(rb+1.5, (i+.5)*360/nb)
    a(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="1.5" fill="none" stroke="{GOLD}" stroke-width=".5"/><circle cx="{x:.2f}" cy="{y:.2f}" r=".45" fill="{GOLD}"/>')
ring(61.6); ring(60.4, 1.3)
zig(58.6, 54.2, 72, fill=False); ring(52.6); ring(51.4, 1.3)
# vành người hóa trang lông chim
nd = 6; rd = 41.6
for i in range(nd):
    a(f'<g transform="rotate({i*360/nd:.2f} {C} {C}) translate({C} {C-rd}) scale(1.28)"><use href="#dancer"/></g>')
    for k in (-1, 1):
        x, y = pol(rd, (i+.5)*360/nd + k*9)
        a(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="1.35" fill="none" stroke="{GOLD}" stroke-width=".5"/><circle cx="{x:.2f}" cy="{y:.2f}" r=".42" fill="{GOLD}"/>')
ring(31.8); ring(30.6, 1.2)
zig(29.6, 25.4, 28, col=GOLD2, op=.9); ring(24.4, .8)
# ngôi sao 14 tia
a(f'<circle cx="{C}" cy="{C}" r="24" fill="{DARK}" opacity=".55"/>')
for i in range(14):
    ang = i*360/14
    tip = pol(23.2, ang); b1 = pol(9.2, ang-360/14*.5+4); b2 = pol(9.2, ang+360/14*.5-4)
    a(f'<path d="M{tip[0]:.2f},{tip[1]:.2f} L{b1[0]:.2f},{b1[1]:.2f} L{b2[0]:.2f},{b2[1]:.2f}Z" fill="{GOLD}"/>')
    t2 = pol(12.4, ang); c1 = pol(21.4, ang+360/14*.5-1.8); c2 = pol(21.4, ang+360/14*.5+1.8)
    a(f'<path d="M{t2[0]:.2f},{t2[1]:.2f} L{c1[0]:.2f},{c1[1]:.2f} L{c2[0]:.2f},{c2[1]:.2f}Z" fill="none" stroke="{GOLD}" stroke-width=".45"/>')
a(f'<circle cx="{C}" cy="{C}" r="9" fill="{BRONZE}" stroke="{GOLD}" stroke-width="1.1"/>')
a(f'<circle cx="{C}" cy="{C}" r="5.4" fill="none" stroke="{GOLD}" stroke-width=".7"/>')
a(f'<circle cx="{C}" cy="{C}" r="2.4" fill="{GOLD}"/>')
a('</svg>')
open(sys.argv[1], 'w', encoding='utf-8').write('\n'.join(out))
print('ok', sys.argv[1])
