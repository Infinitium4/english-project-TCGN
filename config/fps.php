<?php
declare(strict_types=1);
const ARENA_MAP = [
 '1111111111111111',
 '1000000000000001',
 '1000000000000001',
 '1000000000000001',
 '1000110000110001',
 '1000110000110001',
 '1000000000000001',
 '1000000110000001',
 '1000000110000001',
 '1000000000000001',
 '1000110000110001',
 '1000110000110001',
 '1000000000000001',
 '1000000000000001',
 '1000000000000001',
 '1111111111111111',
];
const ARENA_SPAWNS = [[2.5,2.5],[5.5,2.5],[13.5,13.5],[2.5,13.5],[13.5,2.5],[8,12.5],[8,3],[3,8]];
function arena_wall(float $x, float $y): bool {
 return $x < 0 || $y < 0 || $x >= 16 || $y >= 16 || ARENA_MAP[(int)$y][(int)$x] === '1';
}
function arena_clear(float $x, float $y): bool {
 foreach ([[-.24,-.24],[.24,-.24],[-.24,.24],[.24,.24]] as [$dx,$dy]) if (arena_wall($x+$dx,$y+$dy)) return false;
 return true;
}
function arena_distance_to_wall(float $x, float $y, float $angle): float {
 for ($d=0.;$d<24;$d+=.035) if (arena_wall($x+cos($angle)*$d,$y+sin($angle)*$d)) return $d;
 return 24.;
}
function arena_spawn(array $players): array {
 foreach (ARENA_SPAWNS as $spawn) {
  $safe=true;
  foreach ($players as $p) if ($p['hp']>0 && hypot($p['x']-$spawn[0],$p['y']-$spawn[1])<2) $safe=false;
  if ($safe) return $spawn;
 }
 return ARENA_SPAWNS[random_int(0,count(ARENA_SPAWNS)-1)];
}
