import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, Lock, Mail, ShieldCheck, Cpu } from 'lucide-react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?;:{}[]\\/<>+-=~^';

function DecodeText({ text, delay = 0 }: { text: string, delay?: number }) {
  const [started, setStarted] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let t: any;
    if (delay > 0) {
      t = setTimeout(() => setStarted(true), delay);
    } else {
      setStarted(true);
    }
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let iterations = 0;
    const maxIterations = text.length;
    
    setDisplayText(text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));

    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if (index < iterations) return char;
        if (char === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(''));

      if (iterations >= maxIterations) clearInterval(interval);
      
      iterations += 1/2; // Speed control
    }, 30);

    return () => clearInterval(interval);
  }, [text, started]);

  return <span>{started ? displayText : (delay > 0 ? '' : text)}</span>;
}

function WatermarkBackground() {
  const words = ["人工智能", "深度学习", "神经网络", "大语言模型", "职位匹配", "算力引擎", "未来", "认知重构", "数据洪流", "自然语言处理", "超距作用", "量子游标", "极简运算", "多维向量"];
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex flex-col justify-around opacity-[0.02] select-none bg-slate-50 text-purple-900 font-sans font-black text-6xl md:text-8xl lg:text-9xl whitespace-nowrap">
      {[...Array(6)].map((_, i) => (
        <motion.div 
          key={i}
          initial={{ x: i % 2 === 0 ? '-30%' : '0%' }}
          animate={{ x: i % 2 === 0 ? '0%' : '-30%' }}
          transition={{ duration: 60 + i * 5, repeat: Infinity, ease: "linear" }}
          className="flex gap-12"
        >
          {words.concat(words).concat(words).map((word, j) => (
            <span key={j}>{word}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function WireframeInput({ icon: Icon, type = 'text', delay = 0, actionText, onAction, ...props }: any) {
  return (
    <motion.div 
      initial={{ scaleX: 0.01, height: 2, opacity: 0 }}
      animate={{ scaleX: 1, height: 'auto', opacity: 1 }}
      exit={{ opacity: 0, scaleX: 0.8, transition: { duration: 0.2 } }}
      transition={{ 
        opacity: { duration: 0.1, delay },
        scaleX: { duration: 0.4, delay: delay + 0.1, ease: 'easeOut' },
        height: { duration: 0.3, delay: delay + 0.5, ease: 'easeOut' }
      }}
      className="relative flex items-center w-full group"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8 }}
        className="flex w-full items-center bg-transparent border-y border-purple-500/20 group-hover:border-purple-500/40 focus-within:border-purple-500 transition-colors"
      >
        {/* Abstract side nodes */}
        <div className="absolute left-0 w-1 h-3 bg-purple-500/30 group-focus-within:bg-purple-500 transition-colors" />
        <div className="absolute right-0 w-1 h-3 bg-purple-500/30 group-focus-within:bg-purple-500 transition-colors" />

        <div className="pl-5 pr-2 text-purple-500/40 group-focus-within:text-purple-600 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <input 
          type={type}
          {...props}
          className="w-full py-4 pr-4 bg-transparent text-purple-950 placeholder:text-purple-500/40 focus:outline-none text-sm font-sans tracking-widest"
        />
        {actionText && (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 px-4 py-2 mr-4 bg-transparent hover:bg-purple-500/10 text-purple-600 text-xs font-bold tracking-widest uppercase transition-colors border border-purple-500/30"
          >
            {actionText}
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}

function MagneticButton({ children, onClick, className, isSubmitting }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  if (isSubmitting) {
    return (
      <div className="flex justify-center mt-6 h-[50px] items-center relative w-full">
        {/* The shrinking button visual */}
        <motion.div 
          initial={{ scaleX: 1, opacity: 1, y: 0 }}
          animate={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          className="absolute w-full h-full bg-purple-600 flex items-center justify-center text-white font-bold tracking-widest uppercase"
        >
          {children}
        </motion.div>

        {/* The orb and shockwave */}
        <motion.div 
          initial={{ width: 4, height: 4, borderRadius: 2, scale: 0 }}
          animate={{ 
            scale: [0, 6, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ duration: 1.2, delay: 0.2, times: [0, 0.4, 1], ease: "easeOut" }}
          className="absolute bg-white shadow-[0_0_20px_#9333ea]"
        />
        <motion.div 
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 30, opacity: 0, borderWidth: [2, 0] }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full border border-purple-500"
        />
        <motion.div 
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0, borderWidth: [1, 0] }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full border border-purple-300"
        />
      </div>
    );
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={`relative group overflow-hidden w-full h-[50px] mt-6 border border-purple-500/40 hover:border-purple-500 ${className}`}
    >
      <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-600 transition-colors duration-300" />
      
      <span className="relative z-10 flex items-center justify-center h-full text-purple-600 group-hover:text-white font-bold tracking-[0.2em] uppercase text-sm transition-colors duration-300">
        {children}
      </span>
      
      {/* Scanning line effect */}
      <div className="absolute top-0 left-0 w-[2px] h-full bg-purple-300 opacity-0 group-hover:opacity-100 group-hover:animate-[scan_1.5s_ease-in-out_infinite]" />
      <style>{`
        @keyframes scan {
          0% { transform: translateX(0); }
          50% { transform: translateX(100vw); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </motion.button>
  );
}

export default function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Reset submission state after animation completes for demo purposes
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-purple-950 overflow-hidden relative selection:bg-purple-500/20 selection:text-purple-900">
      <WatermarkBackground />

      {/* Grid overlay for coordinate feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #9333ea 1px, transparent 1px),
            linear-gradient(to bottom, #9333ea 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: 'center center'
        }}
      />

      <div className="relative z-10 flex w-full h-full min-h-screen">
        {/* LEFT PANEL: Branding & Text */}
        <div className="hidden lg:flex relative flex-col justify-between w-1/2 p-16 xl:p-24">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-purple-900"
          >
            <Cpu className="w-6 h-6 stroke-[1.5]" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase">
              智聘.AI
            </span>
          </motion.div>

          <div className="max-w-lg">
            <h1 className="text-5xl xl:text-6xl font-light leading-[1.2] text-purple-950 mb-10 tracking-wide">
              拥抱 AI 时代<br/>
              <span className="font-semibold text-purple-600">
                重构职业轨迹
              </span>
            </h1>
            
            <div className="h-[1px] w-12 bg-purple-300/50 mb-10" />
            
            <p className="text-purple-900/40 text-sm leading-loose tracking-widest font-mono">
              <DecodeText text="基于大语言模型与多维向量分析，" delay={200} />
              <br />
              <DecodeText text="为您精准匹配最理想的职位与发展路径。" delay={800} />
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex items-center gap-4 text-[10px] font-mono text-purple-400/60 uppercase tracking-[0.2em]"
          >
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
            <span>系统状态 / 安全在线</span>
          </motion.div>
          
        </div>

        {/* RIGHT PANEL: Forms */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 sm:p-20 bg-white/60 backdrop-blur-md relative">
          <div className="w-full max-w-sm">
            
            {/* Tabs */}
            <div className="flex w-full mb-12 border border-purple-200 p-1 bg-white/50">
              <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all ${mode === 'login' ? 'bg-purple-600/10 text-purple-700 border border-purple-300/50' : 'text-purple-400 hover:text-purple-600'}`}
              >
                身份验证
              </button>
              <button 
                onClick={() => setMode('register')}
                className={`flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all ${mode === 'register' ? 'bg-purple-600/10 text-purple-700 border border-purple-300/50' : 'text-purple-400 hover:text-purple-600'}`}
              >
                新建档案
              </button>
            </div>

            <div className="mb-10 font-mono">
              <motion.div 
                key={`title-${mode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-purple-500 uppercase tracking-[0.3em] mb-2 font-semibold"
              >
                {mode === 'login' ? 'SESSION.INITIATE' : 'RECORD.CREATE'}
              </motion.div>
              <h2 className="text-2xl font-bold tracking-widest text-purple-950">
                <DecodeText text={mode === 'login' ? '欢迎接入连接' : '初始化求职节点'} delay={100} />
              </h2>
            </div>

            <div className="relative w-full min-h-[300px]">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.form 
                    key="login"
                    className="flex flex-col gap-6 w-full"
                    onSubmit={handleSubmit}
                  >
                    <WireframeInput 
                      icon={Mail} 
                      type="text" 
                      placeholder="坐标点 (手机号/邮箱)" 
                      required 
                      delay={0.1}
                    />
                    <WireframeInput 
                      icon={Lock} 
                      type="password" 
                      placeholder="安全密钥" 
                      required 
                      delay={0.3}
                    />
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="flex justify-between items-center px-1 py-2 font-mono"
                    >
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative w-3 h-3 flex items-center justify-center border border-purple-400 transition-colors group-hover:border-purple-600 bg-white">
                          <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                          <div className="w-1.5 h-1.5 bg-purple-500 scale-0 peer-checked:scale-100 transition-transform duration-200" />
                        </div>
                        <span className="text-[10px] text-purple-500 group-hover:text-purple-700 transition-colors uppercase tracking-widest">保持链路畅通</span>
                      </label>
                      <button type="button" className="text-[10px] font-bold text-purple-600 hover:text-purple-800 transition-colors uppercase tracking-widest border-b border-transparent hover:border-purple-500">重置密钥</button>
                    </motion.div>

                    <MagneticButton isSubmitting={isSubmitting}>
                      验证并登录
                    </MagneticButton>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    className="flex flex-col gap-6 w-full"
                    onSubmit={handleSubmit}
                  >
                    <WireframeInput 
                      icon={User} 
                      type="text" 
                      placeholder="指定代号 (用户名)" 
                      required 
                      actionText="扫描冲突"
                      onAction={() => alert('未发现冲突。可用。')}
                      delay={0.1}
                    />
                    <WireframeInput 
                      icon={Phone} 
                      type="text" 
                      placeholder="通信信道 (手机号/邮箱)" 
                      required 
                      delay={0.3}
                    />
                    <WireframeInput 
                      icon={Lock} 
                      type="password" 
                      placeholder="设定密钥 (字母与数字)" 
                      required 
                      delay={0.5}
                    />
                    <WireframeInput 
                      icon={ShieldCheck} 
                      type="password" 
                      placeholder="二次确认密钥" 
                      required 
                      delay={0.7}
                    />

                    <MagneticButton isSubmitting={isSubmitting}>
                      建立并同步档案
                    </MagneticButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Social Logins */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-16 text-center font-mono w-full"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-[1px] flex-1 bg-purple-200" />
                <span className="text-[10px] text-purple-400 tracking-[0.2em] uppercase font-semibold">其他信道接入</span>
                <div className="h-[1px] flex-1 bg-purple-200" />
              </div>
              <div className="flex justify-center gap-3 text-purple-600 text-xs">
                <button className="flex items-center gap-2 flex-1 justify-center px-2 py-3 border border-purple-200 hover:border-purple-500 hover:bg-purple-100/50 transition-all tracking-wider font-semibold bg-white/50 group" aria-label="Google">
                  <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                </button>
                <button className="flex items-center gap-2 flex-1 justify-center px-2 py-3 border border-purple-200 hover:border-purple-500 hover:bg-purple-100/50 transition-all tracking-wider font-semibold bg-white/50 group" aria-label="Facebook">
                  <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </button>
                <button className="flex items-center gap-2 flex-1 justify-center px-2 py-3 border border-purple-200 hover:border-purple-500 hover:bg-purple-100/50 transition-all tracking-wider font-semibold bg-white/50 group" aria-label="LinkedIn">
                  <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
