'use client'

import { useEffect, useState } from 'react'
import { STATIC_PRODUCTS, CATEGORY_ICONS, CATEGORY_GRADIENTS, CATEGORY_LABELS, type Product } from '@/lib/products'

interface CartItem { id: number; name: string; price: number; category: string }

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  const cat      = product.category
  const icon     = CATEGORY_ICONS[cat]    || 'fas fa-box'
  const gradient = product.image_gradient || CATEGORY_GRADIENTS[cat] || 'ps-gradient'
  const catLabel = CATEGORY_LABELS[cat]   || cat
  const priceOld    = product.price_old
  const priceCur    = product.price
  const hasDiscount = !!priceOld && priceOld > priceCur
  const discountPct = hasDiscount ? Math.round((1 - priceCur / priceOld!) * 100) : 0
  const isInStock   = product.stock_status === 'in_stock'
  const isLowStock  = product.stock_status === 'low_stock'
  const isOut       = !isInStock && !isLowStock
  const badgeMap: Record<string,string> = { sale:'badge-sale', hot:'badge-hot', new:'badge-new', bestseller:'badge-bestseller' }
  const badgeRaw    = product.badge || ''
  const badgeClass  = badgeMap[badgeRaw] || 'badge-sale'
  const badgeText   = badgeRaw==='sale' ? `-${discountPct}%` : badgeRaw==='hot' ? '🔥 Hot' : badgeRaw==='new' ? '✨ New' : badgeRaw==='bestseller' ? '⭐ Best' : (hasDiscount&&!badgeRaw?`-${discountPct}%`:badgeRaw)

  return (
    <div className={`product-card${isOut?' out-of-stock':''}`} data-category={cat} data-id={product.id}>
      <div className="product-image">
        {product.image_url ? (
          <div className={`product-image-wrap ${gradient}`}>
            <img src={product.image_url} alt={product.name} className="product-real-img" loading="lazy"
              onError={e=>{const t=e.currentTarget;t.style.display='none';(t.nextElementSibling as HTMLElement).style.display='flex'}} />
            <div className="product-img-fallback" style={{display:'none'}}><i className={icon}></i></div>
          </div>
        ) : (
          <div className={`product-image-placeholder ${gradient}`}><i className={icon}></i></div>
        )}
      </div>
      {badgeText && <div className="product-badges"><span className={badgeClass}>{badgeText}</span></div>}
      <button className="product-wishlist" aria-label="Add to wishlist"><i className="far fa-heart"></i></button>
      <div className="product-info">
        <div className="product-category">{catLabel}</div>
        <h3 className="product-name">{product.name}</h3>
        {product.specs?.length>0 && <div className="product-specs">{product.specs.slice(0,3).map(s=><span key={s} className="spec-chip">{s}</span>)}</div>}
        {product.rating && <div className="product-rating"><span className="stars">★</span> {product.rating.toFixed(1)} <span className="rating-count">({product.rating_count?.toLocaleString()})</span></div>}
        {isOut ? <div className="product-stock out-of-stock"><i className="fas fa-circle-xmark"></i> Out of Stock</div>
          : isLowStock ? <div className="product-stock low-stock"><i className="fas fa-circle-dot"></i> {product.stock_text}</div>
          : <div className="product-stock in-stock"><i className="fas fa-circle-check"></i> {product.stock_text}</div>}
        <div className="product-pricing">
          <span className="price-current">{priceCur.toLocaleString()} LYD</span>
          {hasDiscount && <span className="price-old">{priceOld!.toLocaleString()} LYD</span>}
          {hasDiscount && <span className="price-save">-{discountPct}%</span>}
        </div>
        <button className="btn btn-primary add-to-cart-btn" disabled={isOut} onClick={()=>!isOut&&onAddToCart(product)}>
          {isOut ? 'Out of Stock' : <><i className="fas fa-shopping-cart"></i> Add to Cart</>}
        </button>
      </div>
    </div>
  )
}

function ExpandingCards({ products, onAddToCart }: { products: Product[]; onAddToCart: (p: Product) => void }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isMobile, setIsMobile]   = useState(false)
  useEffect(()=>{
    const check = ()=>setIsMobile(window.innerWidth<768)
    check()
    window.addEventListener('resize',check,{passive:true})
    return ()=>window.removeEventListener('resize',check)
  },[])
  if (!products.length) return <p className="grid-empty"><i className="fas fa-search"></i> No products found.</p>
  const frParts = products.map((_,i)=>i===activeIdx?'5fr':'1fr').join(' ')
  const gridStyle = isMobile ? {gridTemplateRows:frParts,gridTemplateColumns:'1fr'} : {gridTemplateColumns:frParts,gridTemplateRows:'1fr'}
  return (
    <ul className="expanding-cards" style={gridStyle}>
      {products.map((product,i)=>{
        const cat=product.category, icon=CATEGORY_ICONS[cat]||'fas fa-box'
        const priceF=product.price.toLocaleString()
        const waMsg=encodeURIComponent(`السلام عليكم، أريد طلب: ${product.name}\nالسعر: ${priceF} LYD`)
        return (
          <li key={product.id} className={`exp-card${i===activeIdx?' active':''}`} data-category={cat} tabIndex={0}
            onMouseEnter={()=>setActiveIdx(i)} onClick={()=>setActiveIdx(i)} onFocus={()=>setActiveIdx(i)}
            onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setActiveIdx(i)}}}>
            <div className="exp-card-strip"></div>
            <img className="exp-card-img" src={product.image_url} alt={product.name} loading="lazy" />
            <div className="exp-card-overlay"></div>
            <span className="exp-card-side-title">{product.name}</span>
            <div className="exp-card-content">
              <div className="exp-card-icon"><i className={icon}></i></div>
              <div className="exp-card-name">{product.name}</div>
              <div className="exp-card-price-row">
                <span className="exp-card-price">{priceF} LYD</span>
                {product.price_old && <span className="exp-card-price-old">{product.price_old.toLocaleString()} LYD</span>}
              </div>
              {product.rating && <div className="exp-card-rating"><span className="exp-card-star">★</span> {product.rating.toFixed(1)} <span style={{color:'rgba(255,255,255,0.4)'}}>({(product.rating_count||0).toLocaleString()})</span></div>}
              <div className="exp-card-specs">{(product.specs||[]).slice(0,3).map(s=><span key={s} className="exp-card-spec">{s}</span>)}</div>
              <div className="exp-card-actions">
                <button className="exp-card-btn exp-card-btn-primary" onClick={e=>{e.stopPropagation();onAddToCart(product)}}><i className="fas fa-cart-plus"></i> Add to Cart</button>
                <a href={`https://wa.me/218913518615?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="exp-card-btn exp-card-btn-wa" onClick={e=>e.stopPropagation()}><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function Home() {
  const [cart, setCart]                   = useState<CartItem[]>([])
  const [cartOpen, setCartOpen]           = useState(false)
  const [activeSlide, setActiveSlide]     = useState(0)
  const [activeFilter, setActiveFilter]   = useState('all')
  const [dealTimer, setDealTimer]         = useState('07:42:18')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const totalSlides = 3

  useEffect(()=>{
    let s=7*3600+42*60+18
    const t=setInterval(()=>{
      s=Math.max(0,s-1)
      setDealTimer(`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`)
    },1000)
    return ()=>clearInterval(t)
  },[])

  useEffect(()=>{
    const t=setInterval(()=>setActiveSlide(s=>(s+1)%totalSlides),5000)
    return ()=>clearInterval(t)
  },[])

  useEffect(()=>{
    const header=document.getElementById('header')
    if(!header)return
    const fn=()=>header.classList.toggle('scrolled',window.scrollY>50)
    window.addEventListener('scroll',fn,{passive:true})
    return ()=>window.removeEventListener('scroll',fn)
  },[])

  useEffect(()=>{
    const heroSection=document.getElementById('heroSection')
    const heroVideoWrap=document.getElementById('heroVideoWrap')
    if(!heroSection||!heroVideoWrap)return
    let raf=false
    const fn=()=>{
      if(raf)return; raf=true
      requestAnimationFrame(()=>{
        const h=heroSection.offsetHeight||600
        const p=Math.min(Math.max(window.scrollY/h,0),1)
        heroSection.style.setProperty('--scroll-p',String(p))
        heroVideoWrap.style.transform=p>0.05?`perspective(800px) rotateX(${p*12}deg) scale(${1-p*0.06})`:'none'
        raf=false
      })
    }
    window.addEventListener('scroll',fn,{passive:true})
    return ()=>window.removeEventListener('scroll',fn)
  },[])

  useEffect(()=>{
    const c=document.getElementById('heroParticles')
    if(!c)return
    for(let i=0;i<28;i++){
      const p=document.createElement('div')
      p.className='hero-particle'
      p.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;animation-delay:${Math.random()*6}s;animation-duration:${4+Math.random()*8}s;opacity:${0.2+Math.random()*0.6};background:hsl(${Math.random()*60+200},100%,70%);`
      c.appendChild(p)
    }
  },[])

  useEffect(()=>{
    let rafId:number|null=null
    const onMove=(e:PointerEvent)=>{
      if(rafId)return
      rafId=requestAnimationFrame(()=>{
        document.querySelectorAll<HTMLElement>('.product-card').forEach(card=>{
          const r=card.getBoundingClientRect()
          card.style.setProperty('--x',String(e.clientX-r.left))
          card.style.setProperty('--y',String(e.clientY-r.top))
          card.style.setProperty('--xp',String((e.clientX-r.left)/r.width))
          card.style.setProperty('--yp',String((e.clientY-r.top)/r.height))
        })
        rafId=null
      })
    }
    const onOver=(e:PointerEvent)=>{const c=(e.target as Element).closest?.('.product-card') as HTMLElement|null;if(c)c.classList.add('glow-active')}
    const onOut=(e:PointerEvent)=>{const c=(e.target as Element).closest?.('.product-card') as HTMLElement|null;if(c&&!c.contains(e.relatedTarget as Node))c.classList.remove('glow-active')}
    document.addEventListener('pointermove',onMove,{passive:true})
    document.addEventListener('pointerover',onOver as EventListener,{passive:true})
    document.addEventListener('pointerout',onOut as EventListener,{passive:true})
    return ()=>{document.removeEventListener('pointermove',onMove);document.removeEventListener('pointerover',onOver as EventListener);document.removeEventListener('pointerout',onOut as EventListener)}
  },[])

  const addToCart=(product:Product)=>{
    setCart(prev=>[...prev,{id:product.id,name:product.name,price:product.price,category:product.category}])
    setCartOpen(true)
    setTimeout(()=>setCartOpen(false),1200)
  }
  const removeFromCart=(i:number)=>setCart(prev=>prev.filter((_,idx)=>idx!==i))
  const cartTotal=cart.reduce((s,i)=>s+i.price,0)
  const checkout=()=>{
    if(!cart.length)return
    const msg=`طلب جديد من متجر Microsoft:\n${cart.map(i=>`• ${i.name} — ${i.price.toLocaleString()} LYD`).join('\n')}\n\nالإجمالي: ${cartTotal.toLocaleString()} LYD`
    window.open(`https://wa.me/218913518615?text=${encodeURIComponent(msg)}`,'_blank')
  }

  const filteredProducts=activeFilter==='all'?STATIC_PRODUCTS:STATIC_PRODUCTS.filter(p=>p.category===activeFilter)
  const dealProducts=STATIC_PRODUCTS.filter(p=>p.is_deal)

  const slides=[
    {bgClass:'hero-bg-ps5',badge:'✨ وصل حديثاً · New Arrival',badgeColor:'var(--accent)',title:'PlayStation 5 Slim',subtitle:'اكتشف القوة الحقيقية للألعاب. جهاز PS5 الأصلي متوفر الآن في متجر سوني زوارة — مع ضمان كامل.',price:'2,499 LYD',priceOld:'2,899 LYD',priceSave:'وفر 400 د.ل',btnColor:'var(--accent)',delivery:<><i className="fab fa-whatsapp"></i> تواصل معنا على واتساب · <strong>In-store pickup · Zuwarah</strong></>},
    {bgClass:'hero-bg-xbox',badge:'Xbox Series S',badgeColor:'var(--xbox)',title:'Xbox Series S',subtitle:'متوفر الآن في متجر سوني — استعمال بسيط جدا بالباكو وملحقاته الأصليه.',price:'1,899 LYD',priceOld:'2,199 LYD',priceSave:'وفر 300 د.ل',btnColor:'var(--xbox)',delivery:<><i className="fas fa-store"></i> استلام من المتجر · <strong>Zuwarah, Libya</strong></>},
    {bgClass:'hero-bg-games',badge:'🎮 تحميل حصري',badgeColor:'var(--games)',title:'EA Sports FC 26',subtitle:'متوفرة تنزيل — أونلاين وأوفلاين. العب FC 26 بأقل سعر في ليبيا.',price:'85 LYD',priceOld:'120 LYD',priceSave:'وفر 35 د.ل',btnColor:'var(--games)',delivery:<><i className="fas fa-bolt"></i> تسليم فوري · <strong>Instant delivery after payment</strong></>},
  ]

  const navLinks=[
    {cat:'all',icon:'fas fa-fire',label:'Hot Deals'},
    {cat:'playstation',icon:'fab fa-playstation',label:'PlayStation'},
    {cat:'xbox',icon:'fab fa-xbox',label:'Xbox'},
    {cat:'pc',icon:'fas fa-desktop',label:'PC Gaming'},
    {cat:'games',icon:'fas fa-compact-disc',label:'Games'},
    {cat:'accessories',icon:'fas fa-headset',label:'Accessories'},
    {cat:'monitors',icon:'fas fa-tv',label:'Monitors'},
  ]

  return (
    <>
      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          <div className="trust-item"><i className="fab fa-facebook-f"></i><span><strong>3.8K</strong> Followers · 100% Recommend</span></div>
          <div className="trust-item"><i className="fas fa-shield-halved"></i><span><strong>100%</strong> منتجات أصلية · Authentic</span></div>
          <div className="trust-item"><i className="fas fa-location-dot"></i><span>زوارة ليبيا · <strong>Zuwarah, Libya</strong></span></div>
          <div className="trust-item"><i className="fas fa-clock"></i><span>متاح دائماً · <strong>Always Open</strong></span></div>
        </div>
      </div>

      {/* Header */}
      <header className="header" id="header">
        <div className="header-inner">
          <a href="/" className="logo">
            <div className="logo-hex"><span className="logo-hex-ms">MS</span></div>
            <div className="logo-text">
              <span className="logo-name">متجر <span className="accent">سوني</span></span>
              <span className="logo-tagline">بيت الجيمرز · MS Store</span>
            </div>
          </a>
          <div className="search-container">
            <div className="search-wrapper">
              <select className="search-category"><option value="all">All Categories</option><option value="playstation">PlayStation</option><option value="xbox">Xbox</option><option value="pc">PC Gaming</option><option value="games">Games</option><option value="accessories">Accessories</option></select>
              <input type="text" className="search-input" placeholder="Search for PlayStation 5, RTX 4070, gaming headset..." autoComplete="off" />
              <button className="search-btn"><i className="fas fa-search"></i></button>
            </div>
          </div>
          <div className="header-actions">
            <a href="#" className="header-action"><i className="fas fa-user"></i><span>Account</span></a>
            <a href="#" className="header-action"><i className="fas fa-heart"></i><span>Wishlist</span></a>
            <a href="#" className="header-action cart-action" onClick={e=>{e.preventDefault();setCartOpen(true)}}>
              <i className="fas fa-shopping-cart"></i><span>Cart</span><span className="badge">{cart.length}</span>
            </a>
          </div>
          <button className="mobile-toggle" onClick={()=>setMobileNavOpen(v=>!v)}><span></span><span></span><span></span></button>
        </div>
        <nav className={`nav${mobileNavOpen?' open':''}`}>
          <div className="nav-inner">
            {navLinks.map(({cat,icon,label})=>(
              <a key={cat} href="#featured" className={`nav-link${activeFilter===cat?' active':''}`}
                onClick={e=>{e.preventDefault();setActiveFilter(cat);document.getElementById('featured')?.scrollIntoView({behavior:'smooth'})}}>
                <i className={icon}></i> {label}
              </a>
            ))}
            <a href="#blog" className="nav-link"><i className="fas fa-newspaper"></i> Guides</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero" id="heroSection">
        <div className="hero-video-wrap" id="heroVideoWrap">
          <video className="hero-video-bg" autoPlay muted loop playsInline preload="auto">
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-glitch-layer"></div>
          <div className="hero-scanlines"></div>
          <div className="hero-chromatic"></div>
          <div className="hero-vignette"></div>
          <div className="hero-particles" id="heroParticles"></div>
        </div>
        <div className="hero-slider">
          {slides.map((slide,idx)=>(
            <div key={idx} className={`hero-slide${activeSlide===idx?' active':''}`}>
              <div className={`hero-bg ${slide.bgClass}`}></div>
              <div className="hero-content">
                <div className="hero-badge" style={{background:slide.badgeColor}}>{slide.badge}</div>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-price">
                  <span className="hero-price-current">{slide.price}</span>
                  <span className="hero-price-old">{slide.priceOld}</span>
                  <span className="hero-price-save">{slide.priceSave}</span>
                </div>
                <div className="hero-actions">
                  <button className="btn btn-primary btn-lg" style={{background:slide.btnColor}}><i className="fas fa-shopping-cart"></i> أضف للسلة · Add to Cart</button>
                  <button className="btn btn-outline btn-lg"><i className="fas fa-eye"></i> التفاصيل</button>
                </div>
                <div className="hero-delivery">{slide.delivery}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-controls">
          <button className="hero-arrow hero-prev" onClick={()=>setActiveSlide(s=>(s-1+totalSlides)%totalSlides)}><i className="fas fa-chevron-left"></i></button>
          <div className="hero-dots">
            {slides.map((_,idx)=><button key={idx} className={`hero-dot${activeSlide===idx?' active':''}`} onClick={()=>setActiveSlide(idx)}></button>)}
          </div>
          <button className="hero-arrow hero-next" onClick={()=>setActiveSlide(s=>(s+1)%totalSlides)}><i className="fas fa-chevron-right"></i></button>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="section flash-deals" id="deals">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <h2 className="section-title"><i className="fas fa-bolt"></i> Flash Deals</h2>
              <p className="section-subtitle">Ends in <span className="deal-timer">{dealTimer}</span></p>
            </div>
            <a href="#" className="section-link">View All Deals <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="deals-grid">
            {dealProducts.map(p=><ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section featured" id="featured">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <h2 className="section-title"><i className="fas fa-crown"></i> Best Sellers</h2>
              <p className="section-subtitle">Most popular products this week</p>
            </div>
            <div className="filter-tabs">
              {['all','playstation','xbox','pc','games','accessories','monitors'].map(f=>(
                <button key={f} className={`filter-tab${activeFilter===f?' active':''}`} onClick={()=>setActiveFilter(f)}>
                  {f==='all'?'All':CATEGORY_LABELS[f]||f}
                </button>
              ))}
            </div>
          </div>
          <div id="productsGrid">
            <ExpandingCards products={filteredProducts} onAddToCart={addToCart} />
          </div>
        </div>
      </section>

      {/* Loyalty */}
      <section className="section loyalty" id="loyalty">
        <div className="container">
          <div className="loyalty-card">
            <div className="loyalty-content">
              <div className="loyalty-badge"><i className="fas fa-gem"></i> Tech Rewards</div>
              <h2 className="loyalty-title">Join Tech Rewards — Earn on Every Purchase</h2>
              <p className="loyalty-text">Earn 1 point per LYD spent. Redeem for discounts, exclusive deals, and early access to new releases.</p>
              <div className="loyalty-tiers">
                <div className="tier"><div className="tier-icon bronze"><i className="fas fa-medal"></i></div><div className="tier-name">Bronze</div><div className="tier-req">0 - 999 pts</div><div className="tier-perk">2% back</div></div>
                <div className="tier"><div className="tier-icon silver"><i className="fas fa-medal"></i></div><div className="tier-name">Silver</div><div className="tier-req">1,000 - 4,999</div><div className="tier-perk">5% back</div></div>
                <div className="tier"><div className="tier-icon gold"><i className="fas fa-trophy"></i></div><div className="tier-name">Gold</div><div className="tier-req">5,000+</div><div className="tier-perk">10% back</div></div>
              </div>
              <button className="btn btn-primary btn-lg"><i className="fas fa-crown"></i> Join Free Now</button>
            </div>
            <div className="loyalty-visual">
              <div className="loyalty-card-preview">
                <div className="card-chip"></div>
                <div className="card-logo">SONY<span>STORE</span></div>
                <div className="card-number">**** **** **** 7291</div>
                <div className="card-details"><div><span>MEMBER SINCE</span><strong>2026</strong></div><div><span>STATUS</span><strong>GOLD</strong></div></div>
                <div className="card-points">12,450 PTS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Ticker */}
      <section className="section brands">
        <div className="container">
          <div className="section-header"><div className="section-header-left"><h2 className="section-title">Official Brand Partners</h2><p className="section-subtitle">Authorized retailer for the world&apos;s top gaming brands</p></div></div>
          <div className="brands-ticker"><div className="brands-track">
            {['NVIDIA','AMD','Intel','Sony','Microsoft','Samsung','Corsair','Razer','SteelSeries','Logitech','ASUS ROG','MSI','NVIDIA','AMD','Intel','Sony'].map((b,i)=>(
              <div key={i} className="brand-item"><span>{b}</span><small>Partner</small></div>
            ))}
          </div></div>
        </div>
      </section>

      {/* Blog */}
      <section className="section blog" id="blog">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left"><h2 className="section-title"><i className="fas fa-book-open"></i> Buying Guides &amp; News</h2><p className="section-subtitle">Expert advice to help you make the right choice</p></div>
            <a href="#" className="section-link">All Articles <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="blog-grid">
            <article className="blog-card blog-featured">
              <div className="blog-image"><div className="blog-image-placeholder"><i className="fas fa-gamepad"></i></div></div>
              <div className="blog-content"><div className="blog-meta"><span className="blog-tag">Guide</span><span className="blog-date">May 8, 2026</span></div><h3 className="blog-title">Best PS5 Accessories for 2026</h3><p className="blog-excerpt">From the DualSense Edge to the Pulse 3D headset, we break down every must-have accessory for your PS5 setup.</p><a href="#" className="blog-read-more">Read More <i className="fas fa-arrow-right"></i></a></div>
            </article>
            <article className="blog-card">
              <div className="blog-image"><div className="blog-image-placeholder"><i className="fas fa-microchip"></i></div></div>
              <div className="blog-content"><div className="blog-meta"><span className="blog-tag">Comparison</span><span className="blog-date">May 5, 2026</span></div><h3 className="blog-title">RTX 5070 vs RTX 5080</h3><p className="blog-excerpt">We benchmark both cards across 20 games to find the best price-to-performance ratio.</p><a href="#" className="blog-read-more">Read More <i className="fas fa-arrow-right"></i></a></div>
            </article>
            <article className="blog-card">
              <div className="blog-image"><div className="blog-image-placeholder"><i className="fas fa-desktop"></i></div></div>
              <div className="blog-content"><div className="blog-meta"><span className="blog-tag">Setup</span><span className="blog-date">May 1, 2026</span></div><h3 className="blog-title">Gaming Setup Guide for Beginners</h3><p className="blog-excerpt">Everything you need to build your first gaming setup from scratch. Budget-friendly picks included.</p><a href="#" className="blog-read-more">Read More <i className="fas fa-arrow-right"></i></a></div>
            </article>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="section trust">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-feature"><div className="trust-icon"><i className="fas fa-shield-halved"></i></div><h3>100% Authentic</h3><p>Every product comes with manufacturer warranty. Zero counterfeits, guaranteed.</p></div>
            <div className="trust-feature"><div className="trust-icon"><i className="fas fa-truck-fast"></i></div><h3>Fast Delivery</h3><p>Same-day delivery within Zuwarah. Nationwide shipping available.</p></div>
            <div className="trust-feature"><div className="trust-icon"><i className="fas fa-headset"></i></div><h3>24/7 Support</h3><p>Expert gaming advice and after-sales support via WhatsApp, always available.</p></div>
            <div className="trust-feature"><div className="trust-icon"><i className="fas fa-rotate-left"></i></div><h3>Easy Returns</h3><p>7-day return policy on all products. No questions asked.</p></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo"><div className="logo-hex"><span className="logo-hex-ms">MS</span></div><div className="logo-text"><span className="logo-name">متجر <span className="accent">سوني</span></span><span className="logo-tagline">بيت الجيمرز · MS Store</span></div></div>
              <p className="footer-desc">Your #1 gaming destination in Zuwarah, Libya. Official PlayStation, Xbox, and PC gaming hardware.</p>
              <div className="footer-social">
                <a href="#" className="social-btn"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-whatsapp"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
            <div className="footer-col"><h4>Quick Links</h4><ul><li><a href="#deals">Flash Deals</a></li><li><a href="#featured">Best Sellers</a></li><li><a href="#blog">Buying Guides</a></li><li><a href="#loyalty">Rewards</a></li></ul></div>
            <div className="footer-col"><h4>Categories</h4><ul><li><a href="#featured">PlayStation</a></li><li><a href="#featured">Xbox</a></li><li><a href="#featured">PC Gaming</a></li><li><a href="#featured">Accessories</a></li></ul></div>
            <div className="footer-col"><h4>Contact</h4><ul><li><i className="fas fa-location-dot"></i> Zuwarah, Libya</li><li><i className="fab fa-whatsapp"></i> +218 91 351 8615</li><li><i className="fab fa-facebook"></i> MS Store Libya</li><li><i className="fas fa-clock"></i> Always Open</li></ul></div>
          </div>
          <div className="footer-bottom"><p>&copy; 2026 متجر سوني · MS Store. All rights reserved.</p></div>
        </div>
      </footer>

      {/* Cart */}
      <div className={`cart-overlay${cartOpen?' active':''}`} onClick={()=>setCartOpen(false)}></div>
      <div className={`cart-sidebar${cartOpen?' active':''}`}>
        <div className="cart-header">
          <h3><i className="fas fa-shopping-cart"></i> Your Cart</h3>
          <button className="cart-close" onClick={()=>setCartOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="cart-items">
          {cart.length===0 ? (
            <div className="cart-empty"><i className="fas fa-shopping-bag"></i><p>Your cart is empty</p><button className="btn btn-primary" onClick={()=>setCartOpen(false)}>Start Shopping</button></div>
          ) : cart.map((item,i)=>(
            <div key={i} className="cart-item">
              <div className={`cart-item-image ${CATEGORY_GRADIENTS[item.category]||'ps-gradient'}`}><i className={CATEGORY_ICONS[item.category]||'fas fa-box'}></i></div>
              <div className="cart-item-info"><div className="cart-item-name">{item.name}</div><div className="cart-item-price">{item.price.toLocaleString()} LYD</div></div>
              <button className="cart-item-remove" onClick={()=>removeFromCart(i)}><i className="fas fa-trash-alt"></i></button>
            </div>
          ))}
        </div>
        {cart.length>0 && (
          <div className="cart-footer">
            <div className="cart-total-row"><span>Total</span><span>{cartTotal.toLocaleString()} LYD</span></div>
            <button className="btn btn-primary btn-lg cart-checkout" onClick={checkout}><i className="fab fa-whatsapp"></i> Order via WhatsApp</button>
          </div>
        )}
      </div>
    </>
  )
}
