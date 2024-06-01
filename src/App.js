import React, { useState, useEffect, useRef } from 'react';
import { crafts } from './crafts';
import './styles.css';
var path = 'https://hiteku.github.io/img/tos'
var iconWidth = 60

function RadioOptions({ options, selected, handleOptionChange }) {
  return (
    <div className='filter'>
      {options.map((option) => (
        <label key={option.value} className={selected === option.value ? 'selected' : ''}>
          <input
            type="radio"
            name={option.name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => handleOptionChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

function CraftInfo({ craft, craftInfoRef, style }) {
  return (
    <div className="craft-info" ref={craftInfoRef} style={style}>
      <strong>取得方式</strong>
      {(() => {
        var text = craft.acquire.replace('獲得', '獲得 ').replace('使用', '使用 ').replace('昇華', '昇華 ').replace('解放', '解放 ')
        .replace(/\[(.*?)\((\d+)\)\]/g, (match, name, id) => {
          const imgUrl = `https://web-assets.tosconfig.com/gallery/icons/${String(id).padStart(4, '0')}.jpg`;
          const imgElement = `<img style="width: 50px; margin: 1.3px 3.9px -19px 0px; border-radius: 9%" src="${imgUrl}">`
          return `<a href="https://tos.fandom.com/zh/wiki/${id}" target="_blank">${imgElement}</a>`;
        });
        if (!craft.acquire.includes(')]')) text = craft.acquire;
        return (<div dangerouslySetInnerHTML={{ __html: (craft.isCollab && craft.series !== '') ? '《' + craft.series + '》' + text : text }} />);
      })()}
      {(craft.suitable) && (<><hr/><strong>指定角色</strong><br/>{(() => {
        var text = craft.suitable.replace(/\[(.*?)\((\d+)\)\]/g, (match, name, id) => {
          var imgUrl = `https://web-assets.tosconfig.com/gallery/icons/${String(id).padStart(4, '0')}.jpg`;
          // if (id >= 10669 && id <= 10682) imgUrl = `${path}/cards/icon/${String(id).padStart(4, '0')}i.png`;
          const imgElement = `<img style="width: 50px; margin: 1.3px 3.9px -19px 0px; border-radius: 9%" src="${imgUrl}">`
          return `<a href="https://tos.fandom.com/zh/wiki/${id}" target="_blank">${imgElement}</a>`;
        });
        return (<div dangerouslySetInnerHTML={{ __html: text }} />);
      })()}</>)}
      <hr/><strong>儲量條件</strong>
      <br/>{craft.accumulate}
      <hr/><strong>武裝能力</strong>
      {craft.skill.map((item, index) => (
        <div
          style={{ marginRight: '7px', maxWidth: '700px' }}
          key={index}
          dangerouslySetInnerHTML={{ __html: `・${item.replace(/\n/g, '<br>')}` }}
        />
      ))}
      <hr/><strong>龍刻能力</strong>
      {craft.leader.map((item, index) => (
        <div style={{marginRight: '7px', maxWidth: '700px'}} key={index}>・{item}</div>
      ))}
      <div style={{height: '7px'}}></div>
    </div>
  );
}

function App() {
  const [attribute, setAttribute] = useState('none');
  const [race, setRace] = useState('none');
  const [series, setSeries] = useState('all');
  const [accumulate, setAccumulate] = useState('none');
  const [keyword, setKeyword] = useState('');
  const [expandedKeywords, setExpandedKeywords] = useState(false);
  const [showCraftInfo, setShowCraftInfo] = useState(null);
  // const [hoveredCraft, setHoveredCraft] = useState(null);
  const [craftInfoPosition, setCraftInfoPosition] = useState({ top: 0, left: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [craftTypes, setCraftTypes] = useState({
    selfUnlimited: true,
    selfLimited: false,
    cooperativeUnlimited: true,
    cooperativeLimited: false,
  });
  const craftInfoRef = useRef(null);
  const commonKeywords = ['CD-2', 'CD-3', '自攻', '人攻', '回血', '喚靈', '熔爐', '黑金', '通行證'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('button')) {
        setExpandedKeywords(false);
      }
    };

    // 在 component mount 時添加點擊事件監聽器
    document.addEventListener('click', handleClickOutside);

    const handleCraftInfoClick = (event) => {
      if (craftInfoRef.current && !craftInfoRef.current.contains(event.target)) {
        setShowCraftInfo(null);
      }
    };
  
    window.addEventListener('click', handleCraftInfoClick);
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('click', handleCraftInfoClick);
      window.removeEventListener('resize', () => setWindowWidth(window.innerWidth));
    };
  }, [craftInfoRef]);

  const hideTd = windowWidth < 572;

  const handleImageHover = (event, craft) => {
    event.stopPropagation();
    const imagePosition = event.target.getBoundingClientRect();
    setCraftInfoPosition({
      top: `${imagePosition.bottom + window.scrollY - iconWidth - ((craft.suitable) ? 220 : 110)}px`,
      left: `${imagePosition.left + window.scrollX + iconWidth + 3}px`,
    });
    // setHoveredCraft(craft);
    setShowCraftInfo(craft);
  };

  const toggleKeywords = () => {
    setExpandedKeywords(!expandedKeywords);
  };

  const selectKeyword = (keyword) => {
    setKeyword(keyword);
  };

  const handleAttributeChange = (value) => {
    setAttribute(value);
  };

  const handleAccumulateChange = (value) => {
    setAccumulate(value);
  };

  const handleRaceChange = (value) => {
    setRace(value);
  };

  const handleSeriesChange = (event) => {
    setSeries(event.target.value);
  };

  const handleCheckboxChange = (type) => {
    setCraftTypes((prevCraftTypes) => ({
      ...prevCraftTypes,
      [type]: !prevCraftTypes[type],
      ...(type === 'selfLimited' && { cooperativeLimited: false }),
      ...(type === 'cooperativeLimited' && { selfLimited: false }),
    }));
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const attributeOptions = [
    { name: 'attribute', value: 'water', label: '水' },
    { name: 'attribute', value: 'fire', label: '火' },
    { name: 'attribute', value: 'earth', label: '木' },
    { name: 'attribute', value: 'light', label: '光' },
    { name: 'attribute', value: 'dark', label: '暗' },
    { name: 'attribute', value: 'none', label: '不限' },
  ];

  const raceOptions = [
    { name: 'race', value: 'god', label: '神族' },
    { name: 'race', value: 'demon', label: '魔族' },
    { name: 'race', value: 'human', label: '人類' },
    { name: 'race', value: 'beast', label: '獸類' },
    { name: 'race', value: 'dragon', label: '龍類' },
    { name: 'race', value: 'elf', label: '妖精' },
    { name: 'race', value: 'machina', label: '機械' },
    { name: 'race', value: 'none', label: '不限' },
  ];
  
  const accumulateOptions = [
    { name: 'accumulate', value: 'any', label: '首消任何符石' },
    { name: 'accumulate', value: 'specify', label: '首消指定符石' },
    { name: 'accumulate', value: 'launch', label: '發動攻擊次數' },
    { name: 'accumulate', value: 'under', label: '受到攻擊次數' },
    { name: 'accumulate', value: '4C', label: '4 Combo 以上' },
    { name: 'accumulate', value: 'none', label: '不限' },
  ];

  const simplifySkill = (skill) => {
    return skill.toString().replace('攻擊力提升', '攻').replace(/此角色的主動技能[\s\S]*/, '主動技變換')
    .replace(/於自身直行首批消除 1 組 (\d+) 粒或以上(.+?)符石時，自身技能 (.+?) (.+?) (\d+)/, '自身直行首消 $1 連$2 $3$4$5')
    .replace(/消除 (\d+) 組 (\d+) 粒或以上的(.+?)符石，(.*?)攻擊力 (\d+(\.\d+)?) 倍/, '消 $2 連$3_$4攻 $5 倍')
    .replace(/消除 (\d+) 組 (\d+) 粒或以上符石，(.*?)攻擊力 (\d+(\.\d+)?) 倍/, '消 $2 連_$3攻 $4 倍')
    .replace(/消除 (\d+) 粒或以上符石，(.*?)攻擊力 (\d+(\.\d+)?) 倍/, '消 $1 粒_$2攻 $3 倍')
    .replace(/消除 ≥(\d+) 種符石，(.*?)攻擊力額外 (\d+(\.\d+)?) 倍/, '消 ≥$1 種符石_$2攻 $3 倍')
    .replace(/消除(.*?)符石時，(.*?)攻擊力 (\d+(\.\d+)?) 倍/, '消$1_$2攻 $3 倍')
    .replace(/同時消除(.*?)及(.*?)符石，(.*?)攻擊力 (\d+(\.\d+)?) 倍/, '消$1及$2_$3攻 $4 倍')
    .replace(/此召喚獸發動技能的回合，(.*?)攻擊力 (\d+(\.\d+)?) 倍/, '開技_$1攻 $2 倍')
    .replace(/發動主動技能，/, '開技')
    .replace(/發動自身角色符石及消除自身角色符石，自身以 (\d+)% 攻擊力追打 (\d+) 次/, '消除自身角色符石以 $1% 追打 $2 次')
    .replace(/每回合回復 (\d+) 點生命力/, '每回合回復 $1 血')
    .replace(/消除 (\d+) 粒或以上的(.*?)符石，回復 (\d+(\.\d+)?) 倍隊伍回復力等值的生命力/, '消 $1 $2_回 $3 倍隊回的血')
    .replace('必然', '必').replace(/延長移動符石時間 (\d+(\.\d+)?) 秒/, '延 $1 秒')
    .replace(/自身為(.*?)時，自身(.*?) (\d+(\.\d+)?) 倍/, '若$1_自$2 $3 倍')
    .replace(/(.*?)攻擊力 (\d+(\.\d+)?) 倍/, '$1攻 $2 倍')
    .replace('進入關卡後，', '進場 ').replace('自身主動技能 CD 減少 ', 'CD-')
    .replace('自身攻擊無視敵人防禦力', '自身無視敵防').replace('自身無視〖腐化〗敵技', '自身無視腐化')
    .replace('生命力', '血').replace('攻擊力', '攻').replace('額外', '')
    .replaceAll('自身攻', '自攻').replaceAll('屬性', '').replaceAll('族', '').replaceAll('類', '').replaceAll('妖精', '妖').replaceAll('機械', '機')
    .replace('此技能效果不能疊加', '不能疊加').replace('種成員', '種族成員').replace('EP增加', 'EP+').replace('CD減少', 'CD-')
  };

  const filteredCrafts = crafts.filter((craft) => {
    const attributeMatches = attribute === 'none' || craft.attribute.includes(attribute) || craft.attribute === 'none';
    const raceMatches = race === 'none' || craft.race.includes(race) || craft.race === 'none';
    var accumulate_detail;
    switch (accumulate) {
      case 'any': accumulate_detail = '任何'; break;
      case 'launch': accumulate_detail = '裝備此龍刻的召喚獸發動攻擊的次數'; break;
      case 'under': accumulate_detail = '召喚獸受到攻擊次數'; break;
      case '4C': accumulate_detail = '首批消除 ≥4 連擊 (Combo)'; break;
      default: accumulate_detail = '符石'; break;
    }
    const accumulateMatches = accumulate === 'none' || (accumulate === 'specify' ? (!craft.accumulate.includes('任何') && craft.accumulate.includes(accumulate_detail)) : craft.accumulate.includes(accumulate_detail));
    const seriesMatches = (craftTypes.selfUnlimited && !craft.isCollab && craft.series === '') || (craftTypes.selfLimited && !craft.isCollab && craft.series !== '' && (craft.series === series || series === 'all')) ||
    (craftTypes.cooperativeUnlimited && craft.isCollab && craft.series === '') || (craftTypes.cooperativeLimited && craft.isCollab && craft.series !== '' && (craft.series === series || series === 'all'))
    var shk = keyword;
    if (shk.includes('CD-')) shk = '主動技能 CD 減少 ' + shk.split('CD-')[1]
    if (shk.includes('五屬擊')) shk = '五屬攻擊'
    if (shk.includes('延遲')) shk = 'CD +'
    if (shk.includes('延秒')) shk = '延長移動符石時間'
    if (shk.includes('拼圖')) shk = '指定形狀'
    if (shk.includes('直傷')) shk = '敵人造成'
    if (shk.includes('倍回')) shk = '倍隊伍回復力'
    if (shk.includes('回血')) shk = '每回合回復'
    if (shk.includes('固版') || shk.includes('定版')) shk = '數直行'
    const keywordMatches = (
      craft.name.includes(shk) ||
      craft.num.includes(shk) ||
      (craft.num.includes('-') && isNumberInRange(craft.num, shk)) ||
      craft.shape.includes(shk) ||
      craft.series.includes(shk) ||
      craft.acquire.includes(shk) ||
      (craft.suitable?.includes(shk) || false) ||
      craft.accumulate.includes(shk) ||
      simplifySkill(craft.skill).includes(shk) ||
      craft.skill.some(e => e.includes(shk)) ||
      craft.leader.some(e => e.includes(shk)) ||
      craft.tag.includes(shk)
    );
    return attributeMatches && raceMatches && accumulateMatches && seriesMatches && keywordMatches;
  });

  function isNumberInRange(ranges, number) {
    const rangeArray = ranges.split(',').map((range) => range.trim());
    return rangeArray.some((range) => {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        return Number(number) >= start && Number(number) <= end;
      } else {
        return range === number;
      }
    });
  }

  return (
    <>
    <h1>武裝龍刻搜尋器</h1>
    <div className='border'>
      <RadioOptions
        options={attributeOptions}
        selected={attribute}
        handleOptionChange={handleAttributeChange}
      />
      <RadioOptions
        options={raceOptions}
        selected={race}
        handleOptionChange={handleRaceChange}
      />
      <details>
        <summary>更多篩選</summary>
        <div className='filter'>
          <label className={craftTypes.selfUnlimited ? 'selected' : ''}>
            <input
              type="checkbox"
              checked={craftTypes.selfUnlimited}
              onChange={() => handleCheckboxChange('selfUnlimited')}
            />自家非指定
          </label>

          <label className={craftTypes.cooperativeUnlimited ? 'selected' : ''}>
            <input
              type="checkbox"
              checked={craftTypes.cooperativeUnlimited}
              onChange={() => handleCheckboxChange('cooperativeUnlimited')}
            />合作非指定
          </label>

          {/* {hideTd && <br/>} */}
          <label className={craftTypes.selfLimited ? 'selected' : ''}>
            <input
              type="checkbox"
              checked={craftTypes.selfLimited}
              onChange={() => handleCheckboxChange('selfLimited')}
            />自家指定
          </label>
          {(craftTypes.selfLimited) && (<>
          <i className="fa-solid fa-right-long"></i>
          <select value={series} onChange={handleSeriesChange}>
            <option value='all'>不限</option>
            {crafts
              .filter((craft) => !craft.isCollab)
              .map((craft) => craft.series)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((value) => value !== '' && (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select></>)}

          {/* {hideTd && <br/>} */}
          <label className={craftTypes.cooperativeLimited ? 'selected' : ''}>
            <input
              type="checkbox"
              checked={craftTypes.cooperativeLimited}
              onChange={() => handleCheckboxChange('cooperativeLimited')}
            />合作指定
          </label>
          {(craftTypes.cooperativeLimited) && (<>
          <i className="fa-solid fa-right-long"></i>
          <select value={series} onChange={handleSeriesChange}>
            <option value='all'>不限</option>
            {crafts
              .filter((craft) => craft.isCollab)
              .map((craft) => craft.series)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((value) => value !== '' && (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select></>)}
        </div>
        <RadioOptions
          options={accumulateOptions}
          selected={accumulate}
          handleOptionChange={handleAccumulateChange}
        />
      </details>

      <div className='filter'>
        <p>關鍵字：<input type="text" value={keyword} onChange={handleKeywordChange} />
        <button onClick={toggleKeywords}>常用</button></p>
        {expandedKeywords && (
          <div className='keyword-dropdown'>
            {commonKeywords.map((keyword) => (
              <div key={keyword} onClick={() => selectKeyword(keyword)}>{keyword}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', margin: '-6px 0px -24px' }}><sub>點選龍刻圖示查看詳細資料</sub></div>

      <div>
        {showCraftInfo && (
          <CraftInfo
            craft={showCraftInfo}
            craftInfoRef={craftInfoRef}
            style={{ top: craftInfoPosition.top, left: craftInfoPosition.left }}
          />
        )}
        <table className="result-table">
          <thead>
            <tr>
              <th style={{ width: '84px' }}>名稱</th>
              <th style={{ width: '32px' }}>屬性</th>
              <th style={{ width: '32px' }}>種族</th>
              <th style={{ width: '62px' }}>加成</th>
              {!hideTd && <th>武裝能力</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCrafts.map((craft) => (
              <>
              <tr key={craft.num}>
                <td rowSpan={hideTd ? '3' : '2'} style={{ textAlign: 'center', fontSize: '14px' }}>
                  <img
                    src={(craft.tag.includes('全新自家') || (craft.isCollab && craft.series !== '' && craft.series !== '怪物彈珠')) ? (`${path}/crafts/icon/${parseInt(craft.num)+1}.png`) : (craft.num.includes(', ') ? `${path}/crafts/icon/${parseInt(craft.num.slice(0, craft.num.indexOf('-')))+1}.png` : `${path}/crafts/icon/${craft.num}.png`)}
                    alt="img"
                    style={{ width: iconWidth + 'px' }}
                    onClick={(event) => handleImageHover(event, craft)}
                    onMouseEnter={(event) => handleImageHover(event, craft)}
                    // onMouseLeave={() => setHoveredCraft(null)}
                  />
                  <br />
                  {craft.name}
                </td>
                <td>
                  <img
                    src={`${path}/-/${craft.attribute.includes(',') ? ((attribute === craft.attribute.split(', ')[1] || race === craft.race.split(', ')[1]) ? craft.attribute.split(', ')[1] : craft.attribute.split(', ')[0]) : craft.attribute}.png`}
                    alt="img"
                    style={{ width: '25px' }}
                  />
                </td>
                <td>
                  <img
                    src={`${path}/-/${craft.race.includes(',') ? ((attribute === craft.attribute.split(', ')[1] || race === craft.race.split(', ')[1]) ? craft.race.split(', ')[1] : craft.race.split(', ')[0]) : craft.race}.png`}
                    alt="img"
                    style={{ width: '25px' }}
                  />
                </td>
                <td rowSpan="2" style={{ textAlign: 'left'}}>{craft.ability.map((item, index) => (
                  <div key={index}>
                    {index === 0 ? '血' : index === 1 ? '攻' : index === 2 ? '回' : ''}{item}
                  </div>
                ))}</td>
                {!hideTd && (
                  <td rowSpan="2" style={{ textAlign: 'left'}}>
                  {craft.skill.map((item, index) => (
                    <div key={index}>
                      ・{simplifySkill(item)}
                    </div>
                  ))}</td>
                )}
              </tr>
              <tr>
                <td colSpan="2" style={{ fontSize: '14px' }}>{craft.series === '不限' ? '　' : craft.series}</td>
              </tr>
              {hideTd && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'left'}}>
                  {craft.skill.map((item, index) => (
                    <div key={index}>
                      ・{simplifySkill(item)}
                    </div>
                  ))}</td>
                </tr>
              )}
              </>
            ))}
          </tbody>
        </table>
        <div className='src'>
          <sub>
            <a href="https://forum.gamer.com.tw/Co.php?bsn=23805&sn=4065649" target="_blank" rel="noopener noreferrer">
              <img
                src={`https://hiteku.fly.dev/static/assets/logo/bahamut.png`}
                alt="imgBahamut"
              />
            </a>&nbsp;
            <a href="https://www.youtube.com/Hiteku" target="_blank" rel="noopener noreferrer">
              <img
                src={`https://hiteku.fly.dev/static/assets/logo/youtube.png`}
                alt="imgYoutube"
              />
            </a> © 2023 Hiteku
          </sub>
        </div>
      </div>
      <ScrollToTopButton></ScrollToTopButton>
    </div>
    </>
  );
}

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
    background: '#222',
    color: '#fff',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    opacity: showButton ? '1' : '0',
    transition: 'opacity 0.3s ease-in-out'
  };

  return (
    <div style={buttonStyles} onClick={scrollToTop} >
      <i className="fa-solid fa-angle-up"></i>
    </div>
  );
};

export default App;
