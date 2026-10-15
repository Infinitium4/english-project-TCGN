<?php
declare(strict_types=1);
require __DIR__ . '/../config/fps.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function respond(int $status, array $data): never { http_response_code($status); echo json_encode($data, JSON_THROW_ON_ERROR); exit; }
if ($_SERVER['REQUEST_METHOD']!=='POST') respond(405,['error'=>'Utilisez POST.']);
if ((int)($_SERVER['CONTENT_LENGTH']??0)>4096) respond(413,['error'=>'Requête trop volumineuse.']);
try { $input=json_decode(file_get_contents('php://input'),true,16,JSON_THROW_ON_ERROR); } catch (Throwable $e) { respond(400,['error'=>'JSON invalide.']); }
if (!is_array($input)) respond(400,['error'=>'Requête invalide.']);
$room=strtoupper(is_string($input['room']??null)?$input['room']:'');
if (!preg_match('/^[A-Z0-9-]{3,20}$/D',$room)) respond(422,['error'=>'Salon : 3 à 20 lettres, chiffres ou tirets.']);
$action=$input['action']??'tick';
if (!in_array($action,['join','tick','leave'],true)) respond(422,['error'=>'Action inconnue.']);
foreach (['forward','strafe','angle'] as $field) if (isset($input[$field]) && (!is_numeric($input[$field]) || !is_finite((float)$input[$field]))) respond(422,['error'=>'Commande invalide.']);
$path=sys_get_temp_dir().'/tcgn-arena-'.hash('sha256',__DIR__.'|'.$room).'.json';
$file=fopen($path,'c+');
if (!$file || !flock($file,LOCK_EX)) respond(503,['error'=>'Salon indisponible.']);
$raw=stream_get_contents($file);$state=$raw?json_decode($raw,true):null;
if (!is_array($state)) $state=['players'=>[],'events'=>[],'seq'=>0];
$now=microtime(true);
foreach ($state['players'] as $id=>$p) if ($now-$p['seen']>15) unset($state['players'][$id]);
$token=is_string($input['token']??null)?$input['token']:'';$key=hash('sha256',$token);
if ($action==='join') {
 if (count($state['players'])>=8) { flock($file,LOCK_UN);fclose($file);respond(409,['error'=>'Salon complet (8 joueurs).']); }
 $name=trim(is_string($input['name']??null)?$input['name']:'Pilote');$name=preg_replace('/[\x00-\x1F\x7F]/u','',$name)??'Pilote';preg_match_all('/./us',$name,$letters);$name=implode('',array_slice($letters[0],0,20));if($name==='')$name='Pilote';
 $token=bin2hex(random_bytes(24));$key=hash('sha256',$token);[$x,$y]=arena_spawn($state['players']);
 $state['players'][$key]=['id'=>bin2hex(random_bytes(6)),'name'=>$name,'x'=>$x,'y'=>$y,'angle'=>0.,'hp'=>100,'kills'=>0,'deaths'=>0,'seen'=>$now,'shot'=>0.,'respawn'=>0.,'color'=>count($state['players'])%8];
} elseif (!isset($state['players'][$key])) { flock($file,LOCK_UN);fclose($file);respond(401,['error'=>'Session expirée. Rejoignez à nouveau le salon.']); }
if ($action==='leave') unset($state['players'][$key]);
else {
 $player=&$state['players'][$key];$dt=max(0.,min(.2,$now-$player['seen']));$player['seen']=$now;
 if ($player['hp']<=0 && $now>=$player['respawn']) { [$player['x'],$player['y']]=arena_spawn($state['players']);$player['hp']=100; }
 if ($action==='tick' && $player['hp']>0) {
  $player['angle']=fmod((float)($input['angle']??$player['angle']),2*M_PI);
  $f=max(-1.,min(1.,(float)($input['forward']??0)));$s=max(-1.,min(1.,(float)($input['strafe']??0)));$length=max(1.,hypot($f,$s));
  $dx=(cos($player['angle'])*$f-sin($player['angle'])*$s)*3.4*$dt/$length;
  $dy=(sin($player['angle'])*$f+cos($player['angle'])*$s)*3.4*$dt/$length;
  // Small collision steps prevent crossing a wall even after a delayed request.
  for($step=0;$step<4;$step++){if(arena_clear($player['x']+$dx/4,$player['y']))$player['x']+=$dx/4;if(arena_clear($player['x'],$player['y']+$dy/4))$player['y']+=$dy/4;}
  if (($input['fire']??false)===true && $now-$player['shot']>=.27) {
   $player['shot']=$now;$target=null;$distance=arena_distance_to_wall($player['x'],$player['y'],$player['angle']);
   foreach($state['players'] as $otherKey=>$other){
    if($otherKey===$key || $other['hp']<=0)continue;
    $ox=$other['x']-$player['x'];$oy=$other['y']-$player['y'];$along=$ox*cos($player['angle'])+$oy*sin($player['angle']);$across=abs(-$ox*sin($player['angle'])+$oy*cos($player['angle']));
    if($along>0 && $across<.32){$entry=$along-sqrt(.32*.32-$across*$across);if($entry<$distance){$target=$otherKey;$distance=$entry;}}
   }
   $event=['seq'=>++$state['seq'],'type'=>'shot','by'=>$player['id'],'hit'=>null,'at'=>$now];
   if($target!==null){$victim=&$state['players'][$target];$victim['hp']=max(0,$victim['hp']-25);$event['hit']=$victim['id'];if($victim['hp']===0){$victim['deaths']++;$victim['respawn']=$now+3;$player['kills']++;$event['kill']=true;$event['name']=$victim['name'];}unset($victim);}
   $state['events'][]=$event;
  }
 }
 unset($player);
}
$state['events']=array_values(array_filter($state['events'],fn($e)=>$now-$e['at']<4));
rewind($file);ftruncate($file,0);fwrite($file,json_encode($state,JSON_THROW_ON_ERROR));fflush($file);flock($file,LOCK_UN);fclose($file);
$players=array_map(fn($p)=>array_diff_key($p,array_flip(['seen','respawn'])) ,array_values($state['players']));
respond(200,['token'=>$action==='join'?$token:null,'you'=>$state['players'][$key]['id']??null,'players'=>$players,'events'=>$state['events'],'time'=>$now]);
