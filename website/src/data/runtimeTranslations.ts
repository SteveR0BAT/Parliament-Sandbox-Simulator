// Supplemental UI translations for visible strings that were missing from the original dictionaries.
const rows: Record<string, Record<string, string>> = {
  "Voting": {ru:"Голосование",de:"Abstimmungen",fr:"Vote", "zh-CN":"投票",id:"Pemungutan suara",ka:"კენჭისყრა",es:"Votación",ja:"投票",ko:"투표"},
  "Toggle side panel": {ru:"Свернуть или развернуть боковую панель",de:"Seitenleiste ein- oder ausblenden",fr:"Afficher ou masquer le panneau latéral","zh-CN":"切换侧边栏",id:"Tampilkan/sembunyikan panel samping",ka:"გვერდითი პანელის ჩვენება/დამალვა",es:"Mostrar u ocultar el panel lateral",ja:"サイドパネルの表示切り替え",ko:"사이드 패널 표시 전환"},
  "Toggle dark / light mode": {ru:"Переключить тёмную или светлую тему",de:"Zwischen dunklem und hellem Modus wechseln",fr:"Basculer entre le mode sombre et clair","zh-CN":"切换深色/浅色模式",id:"Ganti mode gelap/terang",ka:"მუქი/ღია რეჟიმის გადართვა",es:"Cambiar entre modo oscuro y claro",ja:"ダーク／ライトモードを切り替え",ko:"다크/라이트 모드 전환"},
  "Toggle theme": {ru:"Переключить тему",de:"Design wechseln",fr:"Changer de thème","zh-CN":"切换主题",id:"Ganti tema",ka:"თემის გადართვა",es:"Cambiar tema",ja:"テーマを切り替え",ko:"테마 전환"},
  "Parties with coalition rings": {ru:"Партии с кольцами коалиций",de:"Parteien mit Koalitionsringen",fr:"Partis avec anneaux de coalition","zh-CN":"显示政党及其联盟环",id:"Partai dengan cincin koalisi",ka:"პარტიები კოალიციის რგოლებით",es:"Partidos con anillos de coalición",ja:"連立リング付きの政党",ko:"연합 링이 표시된 정당"},
  "Coalition": {ru:"Коалиция",de:"Koalition",fr:"Coalition","zh-CN":"联盟",id:"Koalisi",ka:"კოალიცია",es:"Coalición",ja:"連立",ko:"연합"},
  "Factions, parties and coalitions": {ru:"Фракции, партии и коалиции",de:"Fraktionen, Parteien und Koalitionen",fr:"Groupes, partis et coalitions","zh-CN":"派系、政党与联盟",id:"Fraksi, partai, dan koalisi",ka:"ფრაქციები, პარტიები და კოალიციები",es:"Facciones, partidos y coaliciones",ja:"会派・政党・連立",ko:"파벌·정당·연합"},
  "Toggle the vote result overlay": {ru:"Показать или скрыть результаты голосования",de:"Abstimmungsergebnis ein- oder ausblenden",fr:"Afficher ou masquer les résultats du vote","zh-CN":"切换投票结果叠加层",id:"Tampilkan/sembunyikan hasil pemungutan suara",ka:"კენჭისყრის შედეგების ფენის გადართვა",es:"Mostrar u ocultar los resultados de la votación",ja:"投票結果オーバーレイの切り替え",ko:"투표 결과 오버레이 전환"},
  "🔒 manual seating": {ru:"🔒 ручное размещение",de:"🔒 manuelle Sitzordnung",fr:"🔒 placement manuel","zh-CN":"🔒 手动排座",id:"🔒 penataan manual",ka:"🔒 ხელით განლაგება",es:"🔒 distribución manual",ja:"🔒 手動配置",ko:"🔒 수동 배치"},
  "Manual seating is locked. Use Auto-arrange in the Parliament tab to restore party blocks.": {ru:"Ручная рассадка заблокирована. Используйте «Автоматическое размещение» на вкладке «Парламент», чтобы восстановить партийные блоки.",de:"Die manuelle Sitzordnung ist gesperrt. Verwenden Sie „Automatisch anordnen“ im Reiter „Parlament“, um die Sitzblöcke der Parteien wiederherzustellen.",fr:"Le placement manuel est verrouillé. Utilisez « Réorganiser automatiquement » dans l’onglet Parlement pour rétablir les blocs des partis.","zh-CN":"手动排座已锁定。请在“议会”选项卡中使用“自动排列”以恢复政党区块。",id:"Penataan manual terkunci. Gunakan Atur otomatis pada tab Parlemen untuk memulihkan blok partai.",ka:"ხელით განლაგება დაბლოკილია. პარტიული ბლოკების აღსადგენად გამოიყენეთ „ავტომატური განლაგება“ პარლამენტის ჩანართში.",es:"La distribución manual está bloqueada. Usa «Organizar automáticamente» en la pestaña Parlamento para restaurar los bloques de los partidos.",ja:"手動配置はロックされています。政党ごとの座席配置を戻すには、議会タブの「自動配置」を使用してください。",ko:"수동 배치가 잠겨 있습니다. 정당별 좌석 블록을 복원하려면 의회 탭에서 '자동 정렬'을 사용하세요."},
  "Leader:": {ru:"Лидер:",de:"Vorsitz:",fr:"Dirigeant :","zh-CN":"领导人：",id:"Pemimpin:",ka:"ლიდერი:",es:"Líder:",ja:"党首：",ko:"대표:"},
  "Faction:": {ru:"Фракция:",de:"Fraktion:",fr:"Groupe :","zh-CN":"派系：",id:"Fraksi:",ka:"ფრაქცია:",es:"Facción:",ja:"会派：",ko:"파벌:"},
  "Coalition:": {ru:"Коалиция:",de:"Koalition:",fr:"Coalition :","zh-CN":"联盟：",id:"Koalisi:",ka:"კოალიცია:",es:"Coalición:",ja:"連立：",ko:"연합:"},
  "Ideology:": {ru:"Идеология:",de:"Ideologie:",fr:"Idéologie :","zh-CN":"意识形态：",id:"Ideologi:",ka:"იდეოლოგია:",es:"Ideología:",ja:"イデオロギー：",ko:"이념:"},
  "Family:": {ru:"Традиция:",de:"Strömung:",fr:"Famille :","zh-CN":"思想传统：",id:"Keluarga:",ka:"მიმართულება:",es:"Familia:",ja:"系譜：",ko:"계열:"},
  "Economic:": {ru:"Экономика:",de:"Wirtschaft:",fr:"Économie :","zh-CN":"经济：",id:"Ekonomi:",ka:"ეკონომიკა:",es:"Economía:",ja:"経済：",ko:"경제:"},
  "Social:": {ru:"Общество:",de:"Gesellschaft:",fr:"Société :","zh-CN":"社会：",id:"Sosial:",ka:"სოციალური:",es:"Sociedad:",ja:"社会：",ko:"사회:"},
  "Authority:": {ru:"Власть:",de:"Staatsmacht:",fr:"Autorité :","zh-CN":"权力：",id:"Otoritas:",ka:"ძალაუფლება:",es:"Autoridad:",ja:"権威：",ko:"권위:"},
  "Vote:": {ru:"Голос:",de:"Stimme:",fr:"Vote :","zh-CN":"投票：",id:"Suara:",ka:"ხმა:",es:"Voto:",ja:"投票：",ko:"표결:"},
  "· seat outline = party colour": {ru:"· контур места = цвет партии",de:"· Sitzumrandung = Parteifarbe",fr:"· contour du siège = couleur du parti","zh-CN":"· 席位边框 = 政党颜色",id:"· garis kursi = warna partai",ka:"· ადგილის კონტური = პარტიის ფერი",es:"· contorno del escaño = color del partido",ja:"・座席の輪郭＝政党色",ko:"· 좌석 테두리 = 정당 색상"},
  "vacant": {ru:"свободно",de:"unbesetzt",fr:"vacant","zh-CN":"空缺",id:"kosong",ka:"ვაკანტური",es:"vacante",ja:"空席",ko:"공석"},
  "No deputies yet — create parties in the Parties tab.": {ru:"Пока нет депутатов — создайте партии на вкладке «Партии».",de:"Noch keine Abgeordneten vorhanden – erstellen Sie Parteien im Reiter „Parteien“.",fr:"Aucun député pour le moment : créez des partis dans l’onglet Partis.","zh-CN":"目前还没有议员——请在“政党”选项卡中创建政党。",id:"Belum ada anggota parlemen — buat partai pada tab Partai.",ka:"დეპუტატები ჯერ არ არის — შექმენით პარტიები „პარტიების“ ჩანართში.",es:"Todavía no hay diputados: crea partidos en la pestaña Partidos.",ja:"議員がまだいません。政党タブで政党を作成してください。",ko:"아직 의원이 없습니다. 정당 탭에서 정당을 만드세요."},
  "Coalition colour (ring)": {ru:"Цвет коалиции (кольцо)",de:"Koalitionsfarbe (Ring)",fr:"Couleur de la coalition (anneau)","zh-CN":"联盟颜色（环）",id:"Warna koalisi (cincin)",ka:"კოალიციის ფერი (რგოლი)",es:"Color de la coalición (anillo)",ja:"連立の色（リング）",ko:"연합 색상(링)"},
  "Create parties first.": {ru:"Сначала создайте партии.",de:"Erstellen Sie zuerst Parteien.",fr:"Créez d’abord des partis.","zh-CN":"请先创建政党。",id:"Buat partai terlebih dahulu.",ka:"ჯერ პარტიები შექმენით.",es:"Primero crea los partidos.",ja:"先に政党を作成してください。",ko:"먼저 정당을 만드세요."},
  "Orientation (optional)": {ru:"Ориентация (необязательно)",de:"Ausrichtung (optional)",fr:"Orientation (facultative)","zh-CN":"政治取向（可选）",id:"Orientasi (opsional)",ka:"ორიენტაცია (არასავალდებულო)",es:"Orientación (opcional)",ja:"政治的立場（任意）",ko:"성향(선택 사항)"},
  "Centre-left": {ru:"Левоцентристская",de:"Mitte-links",fr:"Centre gauche","zh-CN":"中左",id:"Kiri-tengah",ka:"ცენტრისტულ-მემარცხენე",es:"Centroizquierda",ja:"中道左派",ko:"중도좌파"},
  "Ideology (optional)": {ru:"Идеология (необязательно)",de:"Ideologie (optional)",fr:"Idéologie (facultatif)","zh-CN":"意识形态（可选）",id:"Ideologi (opsional)",ka:"იდეოლოგია (არასავალდებულო)",es:"Ideología (opcional)",ja:"イデオロギー（任意）",ko:"이념(선택 사항)"},
  "Visual colour picker": {ru:"Визуальный выбор цвета",de:"Visuelle Farbauswahl",fr:"Sélecteur visuel de couleur","zh-CN":"可视化颜色选择器",id:"Pemilih warna visual",ka:"ფერის ვიზუალური ამრჩევი",es:"Selector visual de color",ja:"ビジュアルカラーピッカー",ko:"시각적 색상 선택기"},
  "HEX colour": {ru:"Цвет HEX",de:"HEX-Farbe",fr:"Couleur HEX","zh-CN":"HEX 颜色",id:"Warna HEX",ka:"HEX ფერი",es:"Color HEX",ja:"HEXカラー",ko:"HEX 색상"},
  "Type any format": {ru:"Введите в любом формате",de:"Format frei eingeben",fr:"Saisir dans n’importe quel format","zh-CN":"可输入任意格式",id:"Ketik dalam format apa pun",ka:"შეიყვანეთ ნებისმიერ ფორმატში",es:"Escribe en cualquier formato",ja:"任意の形式で入力",ko:"어떤 형식으로든 입력"},
  "Suggested:": {ru:"Предлагаемые:",de:"Vorschläge:",fr:"Suggestions :","zh-CN":"建议颜色：",id:"Saran:",ka:"შემოთავაზებული:",es:"Sugeridos:",ja:"候補：",ko:"추천:"},
  "Progressive Faction": {ru:"Прогрессивная фракция",de:"Progressive Fraktion",fr:"Faction progressiste","zh-CN":"进步派系",id:"Fraksi Progresif",ka:"პროგრესული ფრაქცია",es:"Facción progresista",ja:"進歩派会派",ko:"진보파 파벌"},
  "Abbr. (optional)": {ru:"Сокр. (необязательно)",de:"Kürzel (optional)",fr:"Abrév. (facultatif)","zh-CN":"简称（可选）",id:"Singkatan (opsional)",ka:"აბრევიატურა (არასავალდებულო)",es:"Abrev. (opcional)",ja:"略称（任意）",ko:"약칭(선택 사항)"},
  "Suggested shades are derived from the party colour; you can pick anything.": {ru:"Предлагаемые оттенки основаны на цвете партии, но вы можете выбрать любой цвет.",de:"Die vorgeschlagenen Abstufungen leiten sich von der Parteifarbe ab; Sie können aber jede Farbe wählen.",fr:"Les nuances proposées sont dérivées de la couleur du parti, mais vous pouvez choisir n’importe quelle couleur.","zh-CN":"建议色调根据政党颜色生成；您也可以任意选择。",id:"Nuansa yang disarankan berasal dari warna partai; Anda bebas memilih warna apa pun.",ka:"შემოთავაზებული ტონები პარტიის ფერიდან გამომდინარეობს, თუმცა ნებისმიერი ფერის არჩევა შეგიძლიათ.",es:"Los tonos sugeridos derivan del color del partido, pero puedes elegir cualquiera.",ja:"推奨色は政党の色を基にしていますが、自由に選択できます。",ko:"추천 색조는 정당 색상에서 파생되지만 원하는 색상을 선택할 수 있습니다."},
  "Ideology (optional — independent of the party's ideology)": {ru:"Идеология (необязательно — не зависит от идеологии партии)",de:"Ideologie (optional – unabhängig von der Parteideologie)",fr:"Idéologie (facultative — indépendante de celle du parti)","zh-CN":"意识形态（可选——独立于政党的意识形态）",id:"Ideologi (opsional — terpisah dari ideologi partai)",ka:"იდეოლოგია (არასავალდებულო — პარტიის იდეოლოგიისგან დამოუკიდებელი)",es:"Ideología (opcional; independiente de la del partido)",ja:"イデオロギー（任意・政党のイデオロギーとは独立）",ko:"이념(선택 사항 — 정당의 이념과 별개)"},
  "None — assign later": {ru:"Нет — назначить позже",de:"Keine – später zuweisen",fr:"Aucun — attribuer plus tard","zh-CN":"无——稍后分配",id:"Tidak ada — tetapkan nanti",ka:"არცერთი — მოგვიანებით მიენიჭოს",es:"Ninguna — asignar más tarde",ja:"なし — 後で割り当て",ko:"없음 — 나중에 지정"},
  "Faction leader (optional)": {ru:"Лидер фракции (необязательно)",de:"Fraktionsvorsitz (optional)",fr:"Chef de groupe (facultatif)","zh-CN":"派系领导人（可选）",id:"Pemimpin fraksi (opsional)",ka:"ფრაქციის ლიდერი (არასავალდებულო)",es:"Líder de la facción (opcional)",ja:"会派代表（任意）",ko:"파벌 지도자(선택 사항)"},
  "not in a faction": {ru:"вне фракции",de:"in keiner Fraktion",fr:"sans groupe","zh-CN":"未加入派系",id:"tanpa fraksi",ka:"ფრაქციის გარეშე",es:"sin facción",ja:"会派未所属",ko:"파벌 없음"},
  "Assign deputies": {ru:"Назначить депутатов",de:"Abgeordnete zuweisen",fr:"Affecter des députés","zh-CN":"分配议员",id:"Tetapkan anggota parlemen",ka:"დეპუტატების განაწილება",es:"Asignar diputados",ja:"議員を割り当てる",ko:"의원 배정"},
  "Search deputies of this party…": {ru:"Поиск депутатов этой партии…",de:"Abgeordnete dieser Partei suchen …",fr:"Rechercher les députés de ce parti…","zh-CN":"搜索该党的议员…",id:"Cari anggota parlemen partai ini…",ka:"ამ პარტიის დეპუტატების ძიება…",es:"Buscar diputados de este partido…",ja:"この政党の議員を検索…",ko:"이 정당의 의원 검색…"},
  "in": {ru:"в",de:"in",fr:"dans","zh-CN":"属于",id:"di",ka:"ში",es:"en",ja:"所属：",ko:"소속:"},
  "Find on chart": {ru:"Найти на схеме",de:"Im Diagramm finden",fr:"Trouver sur le schéma","zh-CN":"在议会图中查找",id:"Temukan pada bagan",ka:"დიაგრამაზე პოვნა",es:"Buscar en el diagrama",ja:"座席図で探す",ko:"의석도에서 찾기"},
  "No independent deputies.": {ru:"Нет независимых депутатов.",de:"Keine unabhängigen Abgeordneten.",fr:"Aucun député indépendant.","zh-CN":"没有独立议员。",id:"Tidak ada anggota parlemen independen.",ka:"დამოუკიდებელი დეპუტატები არ არის.",es:"No hay diputados independientes.",ja:"無所属議員はいません。",ko:"무소속 의원이 없습니다."},
  "Colour": {ru:"Цвет",de:"Farbe",fr:"Couleur","zh-CN":"颜色",id:"Warna",ka:"ფერი",es:"Color",ja:"色",ko:"색상"},
  "Dashboard": {ru:"Обзор",de:"Übersicht",fr:"Tableau de bord","zh-CN":"总览",id:"Dasbor",ka:"მთავარი პანელი",es:"Panel",ja:"ダッシュボード",ko:"대시보드"},
  "Parliament size & seating": {ru:"Размер парламента и рассадка",de:"Parlamentsgröße und Sitzordnung",fr:"Taille du parlement et disposition des sièges","zh-CN":"议会规模与座席安排",id:"Ukuran parlemen dan penataan kursi",ka:"პარლამენტის ზომა და ადგილების განლაგება",es:"Tamaño del parlamento y distribución de escaños",ja:"議会の規模と座席配置",ko:"의회 규모 및 좌석 배치"},
  "Government designations": {ru:"Статусы в правительстве",de:"Regierungszugehörigkeit",fr:"Désignations gouvernementales","zh-CN":"政府身份标记",id:"Penetapan posisi pemerintahan",ka:"მთავრობის სტატუსები",es:"Designaciones gubernamentales",ja:"政府区分",ko:"정부 지위 지정"},
  "Independent deputies": {ru:"Независимые депутаты",de:"Unabhängige Abgeordnete",fr:"Députés indépendants","zh-CN":"独立议员",id:"Anggota parlemen independen",ka:"დამოუკიდებელი დეპუტატები",es:"Diputados independientes",ja:"無所属議員",ko:"무소속 의원"},
  "Recovery snapshots": {ru:"Резервные копии",de:"Wiederherstellungspunkte",fr:"Instantanés de récupération","zh-CN":"恢复快照",id:"Snapshot pemulihan",ka:"აღდგენის ასლები",es:"Instantáneas de recuperación",ja:"復元スナップショット",ko:"복구 스냅샷"},
  "Up to three recent recovery versions are retained for each project.": {ru:"Для каждого проекта сохраняются до трёх последних версий восстановления.",de:"Für jedes Projekt werden bis zu drei aktuelle Wiederherstellungsversionen gespeichert.",fr:"Jusqu’à trois versions de récupération récentes sont conservées pour chaque projet.","zh-CN":"每个项目最多保留最近三个恢复版本。",id:"Hingga tiga versi pemulihan terbaru disimpan untuk setiap proyek.",ka:"თითოეული პროექტისთვის შენახულია აღდგენის მაქსიმუმ სამი უახლესი ვერსია.",es:"Se conservan hasta tres versiones recientes de recuperación por proyecto.",ja:"各プロジェクトにつき、直近3件までの復元用バージョンを保持します。",ko:"각 프로젝트마다 최근 복구 버전 최대 3개를 보관합니다."},
  "No recovery snapshots are available.": {ru:"Нет доступных резервных копий.",de:"Keine Wiederherstellungspunkte verfügbar.",fr:"Aucun instantané de récupération disponible.","zh-CN":"没有可用的恢复快照。",id:"Tidak ada snapshot pemulihan yang tersedia.",ka:"აღდგენის ასლები ხელმისაწვდომი არ არის.",es:"No hay instantáneas de recuperación disponibles.",ja:"利用可能な復元スナップショットはありません。",ko:"사용 가능한 복구 스냅샷이 없습니다."},
  "Restore": {ru:"Восстановить",de:"Wiederherstellen",fr:"Restaurer","zh-CN":"恢复",id:"Pulihkan",ka:"აღდგენა",es:"Restaurar",ja:"復元",ko:"복원"},
  "Backups": {ru:"Резервные копии",de:"Sicherungen",fr:"Sauvegardes","zh-CN":"备份",id:"Cadangan",ka:"სარეზერვო ასლები",es:"Copias de seguridad",ja:"バックアップ",ko:"백업"},
  "Auto-saved in this browser. Status:": {ru:"Автоматически сохранено в этом браузере. Статус:",de:"In diesem Browser automatisch gespeichert. Status:",fr:"Enregistré automatiquement dans ce navigateur. État :","zh-CN":"已自动保存在此浏览器中。状态：",id:"Tersimpan otomatis di browser ini. Status:",ka:"ამ ბრაუზერში ავტომატურად შენახულია. სტატუსი:",es:"Guardado automáticamente en este navegador. Estado:",ja:"このブラウザーに自動保存されました。状態：",ko:"이 브라우저에 자동 저장됨. 상태:"},
  "Create backup": {ru:"Создать резервную копию",de:"Sicherung erstellen",fr:"Créer une sauvegarde","zh-CN":"创建备份",id:"Buat cadangan",ka:"სარეზერვო ასლის შექმნა",es:"Crear copia de seguridad",ja:"バックアップを作成",ko:"백업 생성"},
  "Import a previously exported .json file; it is added as a new project with the same composition and settings.": {ru:"Импортируйте ранее экспортированный файл .json: он будет добавлен как новый проект с тем же составом и настройками.",de:"Importieren Sie eine zuvor exportierte .json-Datei. Sie wird als neues Projekt mit derselben Zusammensetzung und denselben Einstellungen hinzugefügt.",fr:"Importez un fichier .json précédemment exporté : il sera ajouté comme nouveau projet avec la même composition et les mêmes paramètres.","zh-CN":"导入先前导出的 .json 文件；它将作为具有相同组成和设置的新项目添加。",id:"Impor file .json yang pernah diekspor; file akan ditambahkan sebagai proyek baru dengan susunan dan pengaturan yang sama.",ka:"შემოიტანეთ ადრე ექსპორტირებული .json ფაილი; ის დაემატება ახალ პროექტად იგივე შემადგენლობითა და პარამეტრებით.",es:"Importa un archivo .json exportado anteriormente; se añadirá como un nuevo proyecto con la misma composición y configuración.",ja:"以前にエクスポートした .json ファイルをインポートします。同じ構成と設定の新しいプロジェクトとして追加されます。",ko:"이전에 내보낸 .json 파일을 가져오면 동일한 구성과 설정을 가진 새 프로젝트로 추가됩니다."},
  "Deputy name": {ru:"Имя депутата",de:"Name des Abgeordneten",fr:"Nom du député","zh-CN":"议员姓名",id:"Nama anggota parlemen",ka:"დეპუტატის სახელი",es:"Nombre del diputado",ja:"議員名",ko:"의원 이름"},
  "Political affiliation": {ru:"Политическая принадлежность",de:"Politische Zugehörigkeit",fr:"Affiliation politique","zh-CN":"政治归属",id:"Afiliasi politik",ka:"პოლიტიკური კუთვნილება",es:"Afiliación política",ja:"政治的所属",ko:"정치적 소속"},
  "Reassigning a seat switches the deputy to manual seating.": {ru:"Переназначение места переводит депутата в режим ручной рассадки.",de:"Bei einer Neuzuweisung des Sitzes wird die manuelle Sitzordnung aktiviert.",fr:"Réattribuer un siège fait passer le député au placement manuel.","zh-CN":"重新分配席位会将该议员切换为手动排座模式。",id:"Mengatur ulang kursi akan mengalihkan anggota parlemen ke penataan manual.",ka:"ადგილის ხელახლა მინიჭება დეპუტატს ხელით განლაგების რეჟიმზე გადაიყვანს.",es:"Reasignar un escaño cambia al diputado a la distribución manual.",ja:"座席を再割り当てすると、議員は手動配置に切り替わります。",ko:"좌석을 재배정하면 의원 배치가 수동 모드로 전환됩니다."},
  "— Vacant seat —": {ru:"— Свободное место —",de:"— Freier Sitz —",fr:"— Siège vacant —","zh-CN":"— 空席 —",id:"— Kursi kosong —",ka:"— თავისუფალი ადგილი —",es:"— Escaño vacante —",ja:"— 空席 —",ko:"— 빈 좌석 —"},
  "Independent": {ru:"Независимый",de:"Unabhängig",fr:"Indépendant","zh-CN":"独立议员",id:"Independen",ka:"დამოუკიდებელი",es:"Independiente",ja:"無所属",ko:"무소속"},
  "No faction": {ru:"Без фракции",de:"Keine Fraktion",fr:"Aucun groupe","zh-CN":"无派系",id:"Tanpa fraksi",ka:"ფრაქციის გარეშე",es:"Sin facción",ja:"会派なし",ko:"파벌 없음"},
  "Individual ideology": {ru:"Личная идеология",de:"Individuelle Ideologie",fr:"Idéologie individuelle","zh-CN":"个人意识形态",id:"Ideologi individu",ka:"ინდივიდუალური იდეოლოგია",es:"Ideología individual",ja:"個人のイデオロギー",ko:"개인 이념"},
  "Overrides faction and party ideology in ideology-based voting (default priority).": {ru:"Имеет приоритет над идеологией фракции и партии при голосовании по идеологии (стандартный порядок).",de:"Hat bei ideologiebasierten Abstimmungen Vorrang vor der Ideologie von Fraktion und Partei (Standardpriorität).",fr:"Prend le pas sur l’idéologie du groupe et du parti lors d’un vote fondé sur l’idéologie (priorité par défaut).","zh-CN":"在基于意识形态的投票中优先于派系和政党意识形态（默认优先级）。",id:"Menggantikan ideologi fraksi dan partai dalam pemungutan suara berbasis ideologi (prioritas bawaan).",ka:"იდეოლოგიაზე დაფუძნებული კენჭისყრისას უპირატესია ფრაქციისა და პარტიის იდეოლოგიაზე (ნაგულისხმევი პრიორიტეტი).",es:"Tiene prioridad sobre la ideología de la facción y del partido en votaciones ideológicas (prioridad predeterminada).",ja:"イデオロギーに基づく投票では、会派・政党のイデオロギーより優先されます（既定の優先順位）。",ko:"이념 기반 투표에서 파벌 및 정당 이념보다 우선 적용됩니다(기본 우선순위)."},
  "Inherit from faction / party": {ru:"Унаследовать от фракции / партии",de:"Von Fraktion / Partei übernehmen",fr:"Hériter du groupe / parti","zh-CN":"继承派系/政党设置",id:"Warisi dari fraksi / partai",ka:"ფრაქციისგან / პარტიისგან მემკვიდრეობით მიღება",es:"Heredar de la facción / partido",ja:"会派／政党から継承",ko:"파벌/정당에서 상속"},
  "Effective ideology:": {ru:"Применяемая идеология:",de:"Wirksame Ideologie:",fr:"Idéologie effective :","zh-CN":"实际采用的意识形态：",id:"Ideologi yang berlaku:",ka:"მოქმედი იდეოლოგია:",es:"Ideología efectiva:",ja:"適用されるイデオロギー：",ko:"적용되는 이념:"},
  "Swap with seat #": {ru:"Поменять местами с местом №",de:"Mit Sitz Nr. tauschen",fr:"Échanger avec le siège n°","zh-CN":"与席位编号互换",id:"Tukar dengan kursi nomor",ka:"გაცვლა ადგილის №-თან",es:"Intercambiar con el escaño n.º",ja:"座席番号と入れ替え",ko:"좌석 번호와 교환"},
  "Why:": {ru:"Причина:",de:"Begründung:",fr:"Motif :","zh-CN":"原因：",id:"Alasan:",ka:"მიზეზი:",es:"Motivo:",ja:"理由：",ko:"이유:"},
  "For % present": {ru:"Голосов «за», % присутствующих",de:"Ja-Stimmen in % der Anwesenden",fr:"Pour, % des présents","zh-CN":"赞成票占出席人数比例",id:"Persen suara setuju dari yang hadir",ka:"მომხრეთა წილი დამსწრეებში, %",es:"Porcentaje de votos a favor de los presentes",ja:"出席者に占める賛成の割合",ko:"출석자 중 찬성 비율"},
  "Votes held": {ru:"Проведено голосований",de:"Durchgeführte Abstimmungen",fr:"Votes organisés","zh-CN":"已举行的投票",id:"Jumlah pemungutan suara",ka:"ჩატარებული კენჭისყრები",es:"Votaciones realizadas",ja:"実施した投票数",ko:"실시한 표결 수"},
  "Custom ideologies": {ru:"Пользовательские идеологии",de:"Benutzerdefinierte Ideologien",fr:"Idéologies personnalisées","zh-CN":"自定义意识形态",id:"Ideologi khusus",ka:"მორგებული იდეოლოგიები",es:"Ideologías personalizadas",ja:"カスタム・イデオロギー",ko:"사용자 정의 이념"},
  "— not set —": {ru:"— не задано —",de:"— nicht festgelegt —",fr:"— non défini —","zh-CN":"— 未设置 —",id:"— belum ditetapkan —",ka:"— მითითებული არ არის —",es:"— sin establecer —",ja:"— 未設定 —",ko:"— 설정 안 됨 —"},
  "— unset —": {ru:"— не задано —",de:"— nicht festgelegt —",fr:"— non défini —","zh-CN":"— 未指定 —",id:"— belum diatur —",ka:"— მითითებული არ არის —",es:"— sin definir —",ja:"— 未指定 —",ko:"— 미설정 —"},
  "No parties to configure.": {ru:"Нет партий для настройки.",de:"Keine Parteien zum Konfigurieren vorhanden.",fr:"Aucun parti à configurer.","zh-CN":"没有可配置的政党。",id:"Tidak ada partai untuk dikonfigurasi.",ka:"კონფიგურაციისთვის პარტიები არ არის.",es:"No hay partidos que configurar.",ja:"設定できる政党がありません。",ko:"설정할 정당이 없습니다."},
  "No factions yet. Create some in the Factions tab; deputies without a faction follow their party line.": {ru:"Фракций пока нет. Создайте их на вкладке «Фракции»; депутаты без фракции следуют линии своей партии.",de:"Es gibt noch keine Fraktionen. Erstellen Sie diese im Reiter „Fraktionen“; Abgeordnete ohne Fraktion folgen der Parteilinie.",fr:"Il n’y a pas encore de groupes. Créez-en dans l’onglet Groupes ; les députés sans groupe suivent la ligne de leur parti.","zh-CN":"目前还没有派系。请在“派系”选项卡中创建；未加入派系的议员将遵循所属政党的立场。",id:"Belum ada fraksi. Buat fraksi pada tab Fraksi; anggota parlemen tanpa fraksi mengikuti garis partainya.",ka:"ფრაქციები ჯერ არ არის. შექმენით ისინი „ფრაქციების“ ჩანართში; ფრაქციის გარეშე მყოფი დეპუტატები პარტიის ხაზს მიჰყვებიან.",es:"Todavía no hay facciones. Créelas en la pestaña Facciones; los diputados sin facción siguen la línea de su partido.",ja:"会派がまだありません。会派タブで作成してください。会派に所属しない議員は所属政党の方針に従います。",ko:"아직 파벌이 없습니다. 파벌 탭에서 만드세요. 파벌이 없는 의원은 소속 정당의 노선을 따릅니다."},
  "Specific ideology overrides": {ru:"Индивидуальные настройки идеологий",de:"Spezifische Ideologie-Überschreibungen",fr:"Dérogations propres à une idéologie","zh-CN":"特定意识形态覆盖规则",id:"Penggantian khusus ideologi",ka:"კონკრეტული იდეოლოგიის გადაფარვები",es:"Excepciones por ideología específica",ja:"個別イデオロギーの上書き",ko:"특정 이념별 재정의"},
  "Overrides the group position for one ideology (also custom ideologies), including custom probabilities.": {ru:"Заменяет позицию группы для одной идеологии (в том числе пользовательской), включая индивидуальные вероятности.",de:"Überschreibt die Gruppenposition für eine Ideologie (auch eine benutzerdefinierte), einschließlich eigener Wahrscheinlichkeiten.",fr:"Remplace la position du groupe pour une idéologie (y compris personnalisée), avec des probabilités propres.","zh-CN":"为某一意识形态（包括自定义意识形态）覆盖群体立场，并可设置自定义概率。",id:"Menggantikan posisi kelompok untuk satu ideologi (termasuk ideologi khusus), beserta probabilitas khusus.",ka:"ცვლის ჯგუფის პოზიციას ერთი იდეოლოგიისთვის (მორგებული იდეოლოგიის ჩათვლით) და მის ალბათობებს.",es:"Sustituye la posición del grupo para una ideología (también personalizada), incluidas sus probabilidades.",ja:"特定のイデオロギー（カスタムを含む）について、グループ設定と確率を上書きします。",ko:"사용자 정의 이념을 포함한 특정 이념의 집단 입장과 확률을 재정의합니다."},
  "Add ideology override…": {ru:"Добавить исключение для идеологии…",de:"Ideologie-Ausnahme hinzufügen …",fr:"Ajouter une dérogation idéologique…","zh-CN":"添加意识形态覆盖规则…",id:"Tambahkan penggantian ideologi…",ka:"იდეოლოგიის გადაფარვის დამატება…",es:"Añadir excepción de ideología…",ja:"イデオロギーの上書きを追加…",ko:"이념 재정의 추가…"},
  "All parties": {ru:"Все партии",de:"Alle Parteien",fr:"Tous les partis","zh-CN":"所有政党",id:"Semua partai",ka:"ყველა პარტია",es:"Todos los partidos",ja:"すべての政党",ko:"모든 정당"},
  "Set shown:": {ru:"Назначить показанным:",de:"Angezeigten zuweisen:",fr:"Définir pour les éléments affichés :","zh-CN":"为当前显示项设置：",id:"Tetapkan yang ditampilkan:",ka:"ნაჩვენები დეპუტატების დაყენება:",es:"Establecer para los mostrados:",ja:"表示中の議員に設定：",ko:"표시된 의원에 설정:"},
  "No deputies match.": {ru:"Нет подходящих депутатов.",de:"Keine passenden Abgeordneten.",fr:"Aucun député correspondant.","zh-CN":"没有符合条件的议员。",id:"Tidak ada anggota parlemen yang cocok.",ka:"შესაბამისი დეპუტატი ვერ მოიძებნა.",es:"Ningún diputado coincide.",ja:"該当する議員はいません。",ko:"일치하는 의원이 없습니다."},
  "Weights are normalised automatically so they always sum to 100%. Absent deputies do not count as present.": {ru:"Веса автоматически нормализуются до 100%. Отсутствующие депутаты не считаются присутствующими.",de:"Die Gewichtungen werden automatisch auf 100 % normiert. Abwesende Abgeordnete zählen nicht als anwesend.",fr:"Les pondérations sont automatiquement normalisées à 100 %. Les députés absents ne sont pas comptés parmi les présents.","zh-CN":"权重会自动归一化为总和 100%。缺席议员不计入出席人数。",id:"Bobot dinormalisasi otomatis hingga berjumlah 100%. Anggota parlemen yang absen tidak dihitung hadir.",ka:"წონები ავტომატურად ნორმალიზდება 100%-მდე. არმყოფი დეპუტატები დამსწრეებად არ ითვლებიან.",es:"Los pesos se normalizan automáticamente para sumar el 100 %. Los diputados ausentes no cuentan como presentes.",ja:"重みは合計が常に100％になるよう自動的に正規化されます。欠席議員は出席者に含まれません。",ko:"가중치는 합계가 항상 100%가 되도록 자동 정규화됩니다. 결석 의원은 출석자로 계산되지 않습니다."},
  "All weights are zero — they will be treated as equal.": {ru:"Все веса равны нулю — они будут считаться одинаковыми.",de:"Alle Gewichtungen sind null – sie werden als gleich behandelt.",fr:"Tous les poids sont nuls : ils seront considérés comme égaux.","zh-CN":"所有权重均为零——将按相等权重处理。",id:"Semua bobot bernilai nol — semuanya akan dianggap sama.",ka:"ყველა წონა ნულის ტოლია — ისინი თანაბრად ჩაითვლება.",es:"Todos los pesos son cero; se tratarán como iguales.",ja:"すべての重みがゼロです。同じ重みとして扱われます。",ko:"모든 가중치가 0입니다. 동일한 값으로 처리됩니다."},
  "Party decision": {ru:"Решение партии",de:"Parteientscheidung",fr:"Décision du parti","zh-CN":"政党决定",id:"Keputusan partai",ka:"პარტიის გადაწყვეტილება",es:"Decisión del partido",ja:"政党の決定",ko:"정당 결정"},
  "Choose how each party's deputies decide. Independents follow their own behaviour; individual overrides (below) always win.": {ru:"Выберите, как голосуют депутаты каждой партии. Независимые следуют собственному поведению; индивидуальные настройки ниже всегда имеют приоритет.",de:"Legen Sie fest, wie die Abgeordneten jeder Partei entscheiden. Unabhängige folgen ihrem eigenen Verhalten; individuelle Überschreibungen (unten) haben immer Vorrang.",fr:"Choisissez comment votent les députés de chaque parti. Les indépendants suivent leur propre comportement ; les dérogations individuelles (ci-dessous) restent prioritaires.","zh-CN":"选择各党议员的决策方式。独立议员遵循自己的行为设置；下方的个人覆盖规则始终优先。",id:"Pilih cara anggota parlemen setiap partai mengambil keputusan. Anggota independen mengikuti perilakunya sendiri; pengaturan individu di bawah selalu diutamakan.",ka:"აირჩიეთ, როგორ იღებენ გადაწყვეტილებას თითოეული პარტიის დეპუტატები. დამოუკიდებლები საკუთარ ქცევას მიჰყვებიან; ქვემოთ მოცემულ ინდივიდუალურ გადაფარვებს ყოველთვის უპირატესობა აქვს.",es:"Elige cómo deciden los diputados de cada partido. Los independientes siguen su propio comportamiento; las excepciones individuales (abajo) siempre tienen prioridad.",ja:"各政党の議員の投票方法を選択します。無所属議員は個別の行動設定に従い、下の個人別上書きが常に優先されます。",ko:"각 정당 의원의 결정 방식을 선택하세요. 무소속 의원은 자체 행동 설정을 따르며, 아래의 개별 재정의가 항상 우선합니다."},
  "No factions: deputies follow the party line.": {ru:"Фракций нет: депутаты следуют линии партии.",de:"Keine Fraktionen: Die Abgeordneten folgen der Parteilinie.",fr:"Aucun groupe : les députés suivent la ligne du parti.","zh-CN":"没有派系：议员遵循政党立场。",id:"Tidak ada fraksi: anggota parlemen mengikuti garis partai.",ka:"ფრაქციები არ არის: დეპუტატები პარტიის ხაზს მიჰყვებიან.",es:"No hay facciones: los diputados siguen la línea del partido.",ja:"会派がない場合、議員は政党の方針に従います。",ko:"파벌이 없으면 의원은 정당 노선을 따릅니다."},
  "A · Party-based": {ru:"A · По решению партии",de:"A · Parteibasiert",fr:"A · Selon le parti","zh-CN":"A · 按政党决定",id:"A · Berdasarkan partai",ka:"A · პარტიული",es:"A · Basado en el partido",ja:"A · 政党に基づく",ko:"A · 정당 기반"},
  "Every deputy follows the party's decision (subject to party discipline).": {ru:"Каждый депутат следует решению партии с учётом партийной дисциплины.",de:"Jeder Abgeordnete folgt der Parteientscheidung, vorbehaltlich der Parteidisziplin.",fr:"Chaque député suit la décision de son parti, sous réserve de la discipline du parti.","zh-CN":"每位议员遵循政党决定，但受党纪约束。",id:"Setiap anggota parlemen mengikuti keputusan partai dengan tunduk pada disiplin partai.",ka:"თითოეული დეპუტატი პარტიის გადაწყვეტილებას მიჰყვება პარტიული დისციპლინის გათვალისწინებით.",es:"Cada diputado sigue la decisión del partido, sujeta a la disciplina partidista.",ja:"各議員は党議拘束に従いながら、政党の決定に従います。",ko:"모든 의원은 당 규율에 따라 정당의 결정을 따릅니다."},
  "B · Ideology-based": {ru:"B · По идеологии",de:"B · Ideologiebasiert",fr:"B · Selon l’idéologie","zh-CN":"B · 按意识形态",id:"B · Berdasarkan ideologi",ka:"B · იდეოლოგიური",es:"B · Basado en la ideología",ja:"B · イデオロギーに基づく",ko:"B · 이념 기반"},
  "Deputies vote according to their ideology (individual → faction → party by default) and the position configured for this issue.": {ru:"Депутаты голосуют в соответствии со своей идеологией (по умолчанию: личная → фракционная → партийная) и позицией, заданной для данного вопроса.",de:"Abgeordnete stimmen gemäß ihrer Ideologie (standardmäßig: individuell → Fraktion → Partei) und der für diese Vorlage festgelegten Position ab.",fr:"Les députés votent selon leur idéologie (par défaut : individuelle → groupe → parti) et la position configurée pour cette question.","zh-CN":"议员根据自身意识形态（默认优先级：个人→派系→政党）以及针对该议题配置的立场投票。",id:"Anggota parlemen memilih sesuai ideologi mereka (bawaan: individu → fraksi → partai) dan posisi yang dikonfigurasi untuk isu ini.",ka:"დეპუტატები ხმას აძლევენ საკუთარი იდეოლოგიის (ნაგულისხმევად: ინდივიდუალური → ფრაქციული → პარტიული) და ამ საკითხისთვის განსაზღვრული პოზიციის შესაბამისად.",es:"Los diputados votan según su ideología (por defecto: individual → facción → partido) y la posición configurada para este asunto.",ja:"議員は自身のイデオロギー（既定では個人→会派→政党）と、この議題に設定された立場に従って投票します。",ko:"의원은 자신의 이념(기본 순서: 개인 → 파벌 → 정당)과 해당 안건에 설정된 입장에 따라 투표합니다."},
  "C · Faction-based": {ru:"C · По фракциям",de:"C · Fraktionsbasiert",fr:"C · Selon les groupes","zh-CN":"C · 按派系",id:"C · Berdasarkan fraksi",ka:"C · ფრაქციული",es:"C · Basado en facciones",ja:"C · 会派に基づく",ko:"C · 파벌 기반"},
  "Each faction has its own decision; deputies without a faction follow their party.": {ru:"Каждая фракция принимает собственное решение; депутаты без фракции следуют решению партии.",de:"Jede Fraktion trifft eine eigene Entscheidung; Abgeordnete ohne Fraktion folgen ihrer Partei.",fr:"Chaque groupe prend sa propre décision ; les députés sans groupe suivent leur parti.","zh-CN":"每个派系有自己的决定；未加入派系的议员遵循所属政党。",id:"Setiap fraksi memiliki keputusan sendiri; anggota parlemen tanpa fraksi mengikuti partainya.",ka:"თითოეულ ფრაქციას საკუთარი გადაწყვეტილება აქვს; ფრაქციის გარეშე მყოფი დეპუტატები პარტიას მიჰყვებიან.",es:"Cada facción tiene su propia decisión; los diputados sin facción siguen a su partido.",ja:"各会派が独自に決定し、会派に属さない議員は所属政党に従います。",ko:"각 파벌은 자체 결정을 내리며, 파벌이 없는 의원은 정당을 따릅니다."},
  "D · Individual": {ru:"D · Индивидуальное",de:"D · Individuell",fr:"D · Individuel","zh-CN":"D · 个人决定",id:"D · Individu",ka:"D · ინდივიდუალური",es:"D · Individual",ja:"D · 個人",ko:"D · 개별"},
  "You decide how each single deputy votes.": {ru:"Вы самостоятельно определяете голос каждого депутата.",de:"Sie legen die Stimme jedes einzelnen Abgeordneten fest.",fr:"Vous décidez du vote de chaque député individuellement.","zh-CN":"由您决定每位议员如何投票。",id:"Anda menentukan pilihan setiap anggota parlemen secara individual.",ka:"თქვენ განსაზღვრავთ თითოეული დეპუტატის ხმას.",es:"Decides cómo vota cada diputado.",ja:"各議員の投票を個別に決定します。",ko:"각 의원의 투표를 개별적으로 결정합니다."},
  "E · Fully random": {ru:"E · Полностью случайное",de:"E · Vollständig zufällig",fr:"E · Entièrement aléatoire","zh-CN":"E · 完全随机",id:"E · Sepenuhnya acak",ka:"E · სრულად შემთხვევითი",es:"E · Totalmente aleatorio",ja:"E · 完全ランダム",ko:"E · 완전 무작위"},
  "Each deputy votes independently using the probabilities you set.": {ru:"Каждый депутат голосует независимо в соответствии с заданными вами вероятностями.",de:"Jeder Abgeordnete stimmt unabhängig anhand der von Ihnen festgelegten Wahrscheinlichkeiten ab.",fr:"Chaque député vote indépendamment selon les probabilités que vous définissez.","zh-CN":"每位议员根据您设定的概率独立投票。",id:"Setiap anggota parlemen memilih secara independen berdasarkan probabilitas yang Anda tetapkan.",ka:"თითოეული დეპუტატი დამოუკიდებლად აძლევს ხმას თქვენ მიერ განსაზღვრული ალბათობების მიხედვით.",es:"Cada diputado vota de forma independiente según las probabilidades que establezcas.",ja:"各議員は設定された確率に従って独立して投票します。",ko:"각 의원은 설정한 확률에 따라 독립적으로 투표합니다."},
  "F · Mixed": {ru:"F · Смешанный режим",de:"F · Gemischt",fr:"F · Mixte","zh-CN":"F · 混合模式",id:"F · Campuran",ka:"F · შერეული",es:"F · Mixto",ja:"F · 混合",ko:"F · 혼합"},
  "Choose a method per party; independents and individual overrides are handled too.": {ru:"Выберите метод для каждой партии; независимые депутаты и индивидуальные настройки также учитываются.",de:"Wählen Sie eine Methode pro Partei; Unabhängige und individuelle Überschreibungen werden ebenfalls berücksichtigt.",fr:"Choisissez une méthode par parti ; les indépendants et les dérogations individuelles sont également pris en compte.","zh-CN":"为每个政党选择一种方式；独立议员和个人覆盖规则也会得到处理。",id:"Pilih metode untuk setiap partai; anggota independen dan pengaturan individu juga diperhitungkan.",ka:"აირჩიეთ მეთოდი თითოეული პარტიისთვის; დამოუკიდებელი დეპუტატები და ინდივიდუალური გადაფარვებიც გათვალისწინებულია.",es:"Elige un método por partido; también se gestionan los independientes y las excepciones individuales.",ja:"政党ごとに方式を選択します。無所属議員と個別の上書き設定も処理されます。",ko:"정당별 방식을 선택하며, 무소속 의원과 개별 재정의도 함께 처리됩니다."},
  "All rules must be satisfied (e.g. 60% of present AND 40% of all seats).": {ru:"Все правила должны быть выполнены (например, 60% присутствующих И 40% от общего числа мест).",de:"Alle Regeln müssen erfüllt sein (z. B. 60 % der Anwesenden UND 40 % aller Sitze).",fr:"Toutes les règles doivent être satisfaites (par ex. 60 % des présents ET 40 % de tous les sièges).","zh-CN":"必须满足所有规则（例如，出席者的 60% 且全部席位的 40%）。",id:"Semua aturan harus terpenuhi (misalnya 60% dari yang hadir DAN 40% dari seluruh kursi).",ka:"ყველა წესი უნდა შესრულდეს (მაგ., დამსწრეთა 60% და ყველა ადგილის 40%).",es:"Deben cumplirse todas las reglas (p. ej., el 60 % de los presentes Y el 40 % de todos los escaños).",ja:"すべての規則を満たす必要があります（例：出席者の60％かつ全議席の40％）。",ko:"모든 규칙을 충족해야 합니다(예: 출석 의원의 60% 및 전체 의석의 40%)."},
  "Rule name": {ru:"Название правила",de:"Regelname",fr:"Nom de la règle","zh-CN":"规则名称",id:"Nama aturan",ka:"წესის სახელი",es:"Nombre de la regla",ja:"ルール名",ko:"규칙 이름"},
  "Quorum (% of all seats that must be present)": {ru:"Кворум (% от всех мест, которые должны присутствовать)",de:"Quorum (% aller Sitze, die anwesend sein müssen)",fr:"Quorum (% de l’ensemble des sièges devant être présents)","zh-CN":"法定人数（必须出席的总席位百分比）",id:"Kuorum (% dari seluruh kursi yang harus hadir)",ka:"კვორუმი (ყველა ადგილის %, რომელიც უნდა იყოს წარმოდგენილი)",es:"Quórum (% del total de escaños que deben estar presentes)",ja:"定足数（出席が必要な全議席の割合）",ko:"정족수(전체 의석 중 출석해야 하는 비율)"},
  "0 = no quorum requirement. If quorum is not met, the vote fails.": {ru:"0 = требование кворума отсутствует. Если кворум не достигнут, голосование проваливается.",de:"0 = keine Quorumsanforderung. Wird das Quorum nicht erreicht, scheitert die Abstimmung.",fr:"0 = aucune exigence de quorum. Si le quorum n’est pas atteint, le vote échoue.","zh-CN":"0 = 无法定人数要求。如果未达到法定人数，投票将失败。",id:"0 = tidak ada persyaratan kuorum. Jika kuorum tidak tercapai, pemungutan suara gagal.",ka:"0 = კვორუმის მოთხოვნა არ არსებობს. თუ კვორუმი არ შესრულდა, კენჭისყრა ჩავარდება.",es:"0 = sin requisito de quórum. Si no se alcanza el quórum, la votación fracasa.",ja:"0＝定足数の要件なし。定足数に達しない場合、投票は否決されます。",ko:"0 = 정족수 요건 없음. 정족수가 충족되지 않으면 표결은 부결됩니다."},
  "Chance that a deputy follows the party line. 90% = most follow, a few dissent.": {ru:"Вероятность следования партийной линии. При 90% большинство подчиняется, некоторые выступают против.",de:"Wahrscheinlichkeit, dass ein Abgeordneter der Parteilinie folgt. Bei 90 % folgen die meisten, einige weichen ab.",fr:"Probabilité qu’un député suive la ligne du parti. À 90 %, la plupart suivent, quelques-uns s’écartent.","zh-CN":"议员遵循党派立场的概率。90% 表示大多数人遵循，少数人持不同意见。",id:"Peluang anggota parlemen mengikuti garis partai. Pada 90%, sebagian besar mengikuti dan beberapa menyimpang.",ka:"პარტიის ხაზის მიყოლის ალბათობა. 90%-ზე უმეტესობა მიჰყვება, მცირე ნაწილი კი განსხვავებულ პოზიციას იკავებს.",es:"Probabilidad de que un diputado siga la línea del partido. Con un 90 %, la mayoría la sigue y unos pocos discrepan.",ja:"議員が党の方針に従う確率です。90％なら大半が従い、少数が異なる投票をします。",ko:"의원이 정당 노선을 따를 확률입니다. 90%이면 대부분 따르고 일부는 이탈합니다."},
  "100% = vote follows the configured ideological position probabilities; lower values blend with the random distribution.": {ru:"100% = голос определяется заданными вероятностями идеологической позиции; при меньших значениях они смешиваются со случайным распределением.",de:"100 % = Die Stimme folgt den konfigurierten ideologischen Positionswahrscheinlichkeiten; niedrigere Werte werden mit der Zufallsverteilung gemischt.",fr:"100 % = le vote suit les probabilités de position idéologique configurées ; les valeurs plus faibles les mélangent à la distribution aléatoire.","zh-CN":"100% = 投票完全遵循所配置的意识形态立场概率；较低数值会与随机分布混合。",id:"100% = suara mengikuti probabilitas posisi ideologis yang dikonfigurasi; nilai lebih rendah dicampur dengan distribusi acak.",ka:"100% = ხმა მიჰყვება იდეოლოგიური პოზიციის მითითებულ ალბათობებს; უფრო დაბალი მნიშვნელობები შემთხვევით განაწილებას ერევა.",es:"100 % = el voto sigue las probabilidades de posición ideológica configuradas; los valores inferiores se combinan con la distribución aleatoria.",ja:"100％では設定したイデオロギー上の確率に従います。値を下げるとランダム分布と混合されます。",ko:"100%이면 설정된 이념적 입장 확률을 따르며, 낮은 값일수록 무작위 분포와 혼합됩니다."},
  "Chance a deputy ignores all guidance and votes randomly (uses the random probabilities).": {ru:"Вероятность того, что депутат проигнорирует все указания и проголосует случайно (по заданным случайным вероятностям).",de:"Wahrscheinlichkeit, dass ein Abgeordneter alle Vorgaben ignoriert und zufällig abstimmt (gemäß den Zufallswahrscheinlichkeiten).",fr:"Probabilité qu’un député ignore toutes les consignes et vote au hasard (selon les probabilités aléatoires).","zh-CN":"议员忽略所有指示并随机投票（使用随机概率）的可能性。",id:"Peluang anggota parlemen mengabaikan semua arahan dan memilih secara acak (menggunakan probabilitas acak).",ka:"ალბათობა, რომ დეპუტატი ყველა მითითებას უგულებელყოფს და შემთხვევით მისცემს ხმას (შემთხვევითი ალბათობების მიხედვით).",es:"Probabilidad de que un diputado ignore todas las indicaciones y vote al azar (según las probabilidades aleatorias).",ja:"議員がすべての指針を無視し、設定された確率でランダムに投票する可能性です。",ko:"의원이 모든 지침을 무시하고 무작위 확률에 따라 투표할 가능성입니다."},
  "Ideology priority (first match wins)": {ru:"Приоритет идеологии (первое совпадение)",de:"Ideologiepriorität (erste Übereinstimmung)",fr:"Priorité idéologique (première correspondance)","zh-CN":"意识形态优先级（以首次匹配为准）",id:"Prioritas ideologi (kecocokan pertama berlaku)",ka:"იდეოლოგიის პრიორიტეტი (პირველი დამთხვევა)",es:"Prioridad ideológica (se aplica la primera coincidencia)",ja:"イデオロギーの優先順位（最初の一致を適用）",ko:"이념 우선순위(첫 번째 일치 항목 적용)"},
  "When nothing is configured for a deputy": {ru:"Если для депутата ничего не настроено",de:"Wenn für einen Abgeordneten nichts festgelegt ist",fr:"Lorsqu’aucun paramètre n’est défini pour un député","zh-CN":"未为议员配置任何规则时",id:"Jika tidak ada pengaturan untuk anggota parlemen",ka:"როდესაც დეპუტატისთვის არაფერი არ არის განსაზღვრული",es:"Cuando no hay nada configurado para un diputado",ja:"議員に何も設定されていない場合",ko:"의원에게 설정된 항목이 없을 때"},
  "Random (random probabilities)": {ru:"Случайно (по заданным вероятностям)",de:"Zufällig (Zufallswahrscheinlichkeiten)",fr:"Aléatoire (probabilités aléatoires)","zh-CN":"随机（按随机概率）",id:"Acak (probabilitas acak)",ka:"შემთხვევითი (შემთხვევითი ალბათობები)",es:"Aleatorio (probabilidades aleatorias)",ja:"ランダム（設定した確率）",ko:"무작위(무작위 확률)"},
  "Random distribution used for randomness / unset (For / Against / Abstain)": {ru:"Случайное распределение для случайного выбора / отсутствующей настройки (за / против / воздержаться)",de:"Zufallsverteilung für Zufall / nicht festgelegt (dafür / dagegen / Enthaltung)",fr:"Distribution aléatoire utilisée en cas de hasard / absence de réglage (pour / contre / abstention)","zh-CN":"随机或未设置情况下使用的分布（赞成/反对/弃权）",id:"Distribusi acak untuk pilihan acak / belum diatur (setuju / menolak / abstain)",ka:"შემთხვევითი განაწილება შემთხვევითი არჩევანისთვის / განუსაზღვრელი მდგომარეობისთვის (მომხრე / წინააღმდეგი / თავშეკავება)",es:"Distribución aleatoria para decisiones al azar o no configuradas (a favor / en contra / abstención)",ja:"ランダム／未設定時に使用する分布（賛成／反対／棄権）",ko:"무작위/미설정 시 사용하는 분포(찬성/반대/기권)"},
  "Per-party discipline overrides": {ru:"Индивидуальные настройки дисциплины по партиям",de:"Disziplinüberschreibungen je Partei",fr:"Dérogations à la discipline par parti","zh-CN":"各政党的纪律覆盖设置",id:"Penggantian disiplin per partai",ka:"დისციპლინის გადაფარვები პარტიების მიხედვით",es:"Excepciones de disciplina por partido",ja:"政党ごとの規律上書き",ko:"정당별 규율 재정의"},
  "global": {ru:"общая",de:"global",fr:"global","zh-CN":"全局",id:"global",ka:"გლობალური",es:"global",ja:"全体",ko:"전역"},
  "Party lines (fallback for deputies without a faction)": {ru:"Линия партии (для депутатов без фракции)",de:"Parteilinie (Fallback für fraktionslose Abgeordnete)",fr:"Ligne du parti (solution de repli pour les députés sans groupe)","zh-CN":"政党立场（无派系议员的后备规则）",id:"Garis partai (cadangan bagi anggota tanpa fraksi)",ka:"პარტიის ხაზი (სარეზერვო წესი ფრაქციის გარეშე მყოფი დეპუტატებისთვის)",es:"Línea del partido (alternativa para diputados sin facción)",ja:"政党方針（会派に属さない議員の代替設定）",ko:"정당 노선(파벌이 없는 의원의 대체 규칙)"},
  "Method per party": {ru:"Метод для каждой партии",de:"Methode je Partei",fr:"Méthode par parti","zh-CN":"各政党的决策方式",id:"Metode per partai",ka:"მეთოდი თითოეული პარტიისთვის",es:"Método por partido",ja:"政党ごとの方式",ko:"정당별 방식"},
  "Ideological positions (for parties using ideology)": {ru:"Идеологические позиции (для партий, использующих идеологию)",de:"Ideologische Positionen (für ideologiebasierte Parteien)",fr:"Positions idéologiques (pour les partis utilisant l’idéologie)","zh-CN":"意识形态立场（适用于按意识形态投票的政党）",id:"Posisi ideologis (untuk partai yang menggunakan ideologi)",ka:"იდეოლოგიური პოზიციები (იდეოლოგიის გამომყენებელი პარტიებისთვის)",es:"Posiciones ideológicas (para partidos que usan ideología)",ja:"イデオロギー上の立場（イデオロギー方式を使う政党向け）",ko:"이념적 입장(이념 방식을 사용하는 정당용)"},
  "Individual overrides": {ru:"Индивидуальные настройки",de:"Individuelle Überschreibungen",fr:"Dérogations individuelles","zh-CN":"个人覆盖规则",id:"Penggantian individu",ka:"ინდივიდუალური გადაფარვები",es:"Excepciones individuales",ja:"個別設定の上書き",ko:"개별 재정의"},
  "Default for deputies without a decision": {ru:"По умолчанию для депутатов без решения",de:"Standard für Abgeordnete ohne Entscheidung",fr:"Par défaut pour les députés sans décision","zh-CN":"未作出决定的议员的默认选项",id:"Bawaan untuk anggota tanpa keputusan",ka:"ნაგულისხმევი არჩევანი გადაწყვეტილების არმქონე დეპუტატებისთვის",es:"Predeterminado para diputados sin decisión",ja:"個別の決定がない議員の既定値",ko:"결정이 없는 의원의 기본값"},
  "Majority threshold": {ru:"Порог большинства",de:"Mehrheitsschwelle",fr:"Seuil de majorité","zh-CN":"多数门槛",id:"Ambang mayoritas",ka:"უმრავლესობის ზღვარი",es:"Umbral de mayoría",ja:"過半数の基準",ko:"과반수 기준"},
  "Select to compare (max 2)": {ru:"Выберите для сравнения (макс. 2)",de:"Zum Vergleichen auswählen (max. 2)",fr:"Sélectionner pour comparer (max. 2)","zh-CN":"选择以进行比较（最多 2 项）",id:"Pilih untuk dibandingkan (maks. 2)",ka:"შეარჩიეთ შესადარებლად (მაქს. 2)",es:"Seleccionar para comparar (máx. 2)",ja:"比較対象を選択（最大2件）",ko:"비교할 항목 선택(최대 2개)"},
  "Rename vote": {ru:"Переименовать голосование",de:"Abstimmung umbenennen",fr:"Renommer le vote","zh-CN":"重命名投票",id:"Ganti nama pemungutan suara",ka:"კენჭისყრის სახელის შეცვლა",es:"Renombrar votación",ja:"投票名を変更",ko:"표결 이름 변경"},
  "Re-run the same issue configuration with a new random draw": {ru:"Повторить голосование с теми же настройками и новой случайной выборкой",de:"Dieselbe Abstimmungskonfiguration mit einer neuen Zufallsziehung erneut ausführen",fr:"Relancer le même vote avec une nouvelle séquence aléatoire","zh-CN":"使用相同议题配置重新运行，并生成新的随机结果",id:"Jalankan ulang konfigurasi isu yang sama dengan pengundian acak baru",ka:"იგივე საკითხის კონფიგურაციით ხელახლა ჩაატარეთ კენჭისყრა ახალი შემთხვევითი შედეგით",es:"Repetir la misma configuración del asunto con una nueva selección aleatoria",ja:"同じ議題設定で新しい乱数を使って再実行",ko:"동일한 안건 설정으로 새로운 무작위 추첨을 통해 다시 실행"},
  "For % (present)": {ru:"За, % от присутствующих",de:"Dafür, % der Anwesenden",fr:"Pour, % des présents","zh-CN":"赞成票占出席者比例",id:"Setuju, % dari yang hadir",ka:"მომხრე, დამსწრეთა %",es:"A favor, % de presentes",ja:"賛成（出席者に占める割合）",ko:"찬성(출석자 대비 %)"},
  "Select one more vote to compare.": {ru:"Выберите ещё одно голосование для сравнения.",de:"Wählen Sie eine weitere Abstimmung zum Vergleichen aus.",fr:"Sélectionnez un autre vote à comparer.","zh-CN":"再选择一次投票以进行比较。",id:"Pilih satu pemungutan suara lagi untuk dibandingkan.",ka:"შესადარებლად კიდევ ერთი კენჭისყრა აირჩიეთ.",es:"Selecciona una votación más para comparar.",ja:"比較する投票をもう1件選択してください。",ko:"비교할 표결을 하나 더 선택하세요."},
  "Group": {ru:"Группа",de:"Gruppe",fr:"Groupe","zh-CN":"群体",id:"Kelompok",ka:"ჯგუფი",es:"Grupo",ja:"グループ",ko:"그룹"},
  "Distribution": {ru:"Распределение",de:"Verteilung",fr:"Répartition","zh-CN":"分布",id:"Distribusi",ka:"განაწილება",es:"Distribución",ja:"分布",ko:"분포"},
  "Present": {ru:"Присутствуют",de:"Anwesend",fr:"Présents","zh-CN":"出席",id:"Hadir",ka:"დამსწრე",es:"Presentes",ja:"出席",ko:"출석"},
  "For % valid": {ru:"За, % действительных голосов",de:"Dafür, % der gültigen Stimmen",fr:"Pour, % des suffrages valides","zh-CN":"赞成票占有效票比例",id:"Setuju, % suara sah",ka:"მომხრე, ვალიდური ხმების %",es:"A favor, % de votos válidos",ja:"有効票に占める賛成の割合",ko:"유효표 중 찬성 비율"},
  "For % of seats": {ru:"За, % от всех мест",de:"Dafür, % aller Sitze",fr:"Pour, % de l’ensemble des sièges","zh-CN":"赞成票占全部席位比例",id:"Setuju, % dari seluruh kursi",ka:"მომხრე, ყველა ადგილის %",es:"A favor, % del total de escaños",ja:"全議席に占める賛成の割合",ko:"전체 의석 중 찬성 비율"},
  "Vacant": {ru:"Свободные места",de:"Unbesetzt",fr:"Vacants","zh-CN":"空缺",id:"Kosong",ka:"ვაკანტური",es:"Vacantes",ja:"空席",ko:"공석"},
  "By party": {ru:"По партиям",de:"Nach Partei",fr:"Par parti","zh-CN":"按政党",id:"Menurut partai",ka:"პარტიების მიხედვით",es:"Por partido",ja:"政党別",ko:"정당별"},
  "By coalition": {ru:"По коалициям",de:"Nach Koalition",fr:"Par coalition","zh-CN":"按联盟",id:"Menurut koalisi",ka:"კოალიციების მიხედვით",es:"Por coalición",ja:"連立別",ko:"연합별"},
  "By faction": {ru:"По фракциям",de:"Nach Fraktion",fr:"Par groupe","zh-CN":"按派系",id:"Menurut fraksi",ka:"ფრაქციების მიხედვით",es:"Por facción",ja:"会派別",ko:"파벌별"},
  "Vote": {ru:"Голос",de:"Stimme",fr:"Vote","zh-CN":"投票",id:"Suara",ka:"ხმა",es:"Voto",ja:"投票",ko:"표결"},
  "By percentages…": {ru:"По процентам…",de:"Nach Prozenten …",fr:"Par pourcentages…","zh-CN":"按百分比分配…",id:"Berdasarkan persentase…",ka:"პროცენტების მიხედვით…",es:"Por porcentajes…",ja:"割合で…",ko:"비율별…"},
  "Merge…": {ru:"Объединить…",de:"Zusammenführen …",fr:"Fusionner…","zh-CN":"合并…",id:"Gabungkan…",ka:"გაერთიანება…",es:"Fusionar…",ja:"統合…",ko:"병합…"},
  "Merge parties": {ru:"Объединить партии",de:"Parteien zusammenführen",fr:"Fusionner les partis","zh-CN":"合并政党",id:"Gabungkan partai",ka:"პარტიების გაერთიანება",es:"Fusionar partidos",ja:"政党を統合",ko:"정당 병합"},
  "Enter vote shares; seats are apportioned among parties with the largest-remainder method (independents keep their seats).": {ru:"Введите доли голосов; места распределяются между партиями методом наибольших остатков (независимые сохраняют свои места).",de:"Geben Sie Stimmenanteile ein; die Sitze werden nach dem größten-Rest-Verfahren auf die Parteien verteilt (Unabhängige behalten ihre Sitze).",fr:"Saisissez les parts de voix ; les sièges sont répartis entre les partis selon la méthode des plus forts restes (les indépendants conservent leurs sièges).","zh-CN":"输入得票比例；席位按最大余数法分配给各政党（独立议员保留席位）。",id:"Masukkan persentase suara; kursi dibagikan kepada partai dengan metode sisa terbesar (anggota independen mempertahankan kursinya).",ka:"შეიყვანეთ ხმების წილი; ადგილები პარტიებს შორის უდიდესი ნაშთის მეთოდით ნაწილდება (დამოუკიდებლები ადგილებს ინარჩუნებენ).",es:"Introduce los porcentajes de voto; los escaños se reparten entre los partidos mediante el método de restos mayores (los independientes conservan sus escaños).",ja:"得票率を入力すると、最大剰余方式で政党に議席を配分します（無所属議員の議席は維持されます）。",ko:"득표율을 입력하면 최대 잔여 방식으로 정당에 의석을 배분합니다(무소속 의원의 의석은 유지됩니다)."},
  "Merge selected parties (and their factions and deputies) into the target party. Coalition memberships are transferred.": {ru:"Объединить выбранные партии, их фракции и депутатов с целевой партией. Членство в коалициях будет перенесено.",de:"Führen Sie die ausgewählten Parteien samt Fraktionen und Abgeordneten in der Zielpartei zusammen. Koalitionsmitgliedschaften werden übertragen.",fr:"Fusionnez les partis sélectionnés, leurs groupes et leurs députés avec le parti cible. Les appartenances aux coalitions sont transférées.","zh-CN":"将所选政党及其派系和议员合并到目标政党。联盟成员关系也会转移。",id:"Gabungkan partai terpilih beserta fraksi dan anggotanya ke partai tujuan. Keanggotaan koalisi akan dipindahkan.",ka:"არჩეული პარტიები, მათი ფრაქციები და დეპუტატები გააერთიანეთ სამიზნე პარტიაში. კოალიციებში წევრობაც გადაინაცვლებს.",es:"Fusiona los partidos seleccionados (y sus facciones y diputados) en el partido de destino. Se transfieren las pertenencias a coaliciones.",ja:"選択した政党、その会派および議員を統合先の政党にまとめます。連立への所属も引き継がれます。",ko:"선택한 정당과 그 파벌 및 의원을 대상 정당으로 통합합니다. 연합 소속도 이전됩니다."},
  "Target party…": {ru:"Целевая партия…",de:"Zielpartei …",fr:"Parti cible…","zh-CN":"目标政党…",id:"Partai tujuan…",ka:"სამიზნე პარტია…",es:"Partido de destino…",ja:"統合先の政党…",ko:"대상 정당…"},
  "No parties yet. Create the first one to start filling the chamber.": {ru:"Пока нет партий. Создайте первую, чтобы начать заполнять парламент.",de:"Noch keine Parteien vorhanden. Erstellen Sie die erste, um das Parlament zu füllen.",fr:"Aucun parti pour le moment. Créez le premier pour commencer à remplir l’assemblée.","zh-CN":"目前还没有政党。创建第一个政党即可开始填充议会席位。",id:"Belum ada partai. Buat partai pertama untuk mulai mengisi parlemen.",ka:"პარტიები ჯერ არ არის. პარლამენტის შესავსებად შექმენით პირველი პარტია.",es:"Todavía no hay partidos. Crea el primero para empezar a ocupar el hemiciclo.",ja:"政党がまだありません。最初の政党を作成して議席を埋め始めましょう。",ko:"아직 정당이 없습니다. 첫 정당을 만들어 의석을 채우세요."},
  "Highlight this party in the chamber": {ru:"Выделить эту партию в парламенте",de:"Diese Partei im Plenum hervorheben",fr:"Mettre ce parti en évidence dans l’assemblée","zh-CN":"在议会中突出显示该政党",id:"Sorot partai ini di parlemen",ka:"ამ პარტიის გამოკვეთა პარლამენტში",es:"Resaltar este partido en la cámara",ja:"議場でこの政党を強調表示",ko:"의회에서 이 정당 강조 표시"},
  "Party name": {ru:"Название партии",de:"Parteiname",fr:"Nom du parti","zh-CN":"政党名称",id:"Nama partai",ka:"პარტიის სახელი",es:"Nombre del partido",ja:"政党名",ko:"정당 이름"},
  "Party leader": {ru:"Лидер партии",de:"Parteivorsitz",fr:"Chef du parti","zh-CN":"政党领导人",id:"Pemimpin partai",ka:"პარტიის ლიდერი",es:"Líder del partido",ja:"党首",ko:"정당 대표"},
  "Government designation": {ru:"Статус по отношению к правительству",de:"Regierungsstatus",fr:"Statut gouvernemental","zh-CN":"政府阵营身份",id:"Status pemerintahan",ka:"მთავრობის სტატუსი",es:"Designación gubernamental",ja:"政府内での立場",ko:"정부 내 지위"},
  "Logo / symbol": {ru:"Логотип / символ",de:"Logo / Symbol",fr:"Logo / symbole","zh-CN":"标志/符号",id:"Logo / simbol",ka:"ლოგო / სიმბოლო",es:"Logotipo / símbolo",ja:"ロゴ／シンボル",ko:"로고/상징"},
  "Description": {ru:"Описание",de:"Beschreibung",fr:"Description","zh-CN":"描述",id:"Deskripsi",ka:"აღწერა",es:"Descripción",ja:"説明",ko:"설명"},
  "Additional metadata": {ru:"Дополнительные сведения",de:"Zusätzliche Metadaten",fr:"Métadonnées supplémentaires","zh-CN":"附加元数据",id:"Metadata tambahan",ka:"დამატებითი მეტამონაცემები",es:"Metadatos adicionales",ja:"追加メタデータ",ko:"추가 메타데이터"},
  "Give the party a name.": {ru:"Укажите название партии.",de:"Geben Sie der Partei einen Namen.",fr:"Donnez un nom au parti.","zh-CN":"请为政党命名。",id:"Beri nama untuk partai.",ka:"მიუთითეთ პარტიის სახელი.",es:"Asigna un nombre al partido.",ja:"政党名を入力してください。",ko:"정당 이름을 입력하세요."},
  "Seat allocation": {ru:"Распределение мест",de:"Sitzverteilung",fr:"Répartition des sièges","zh-CN":"席位分配",id:"Alokasi kursi",ka:"ადგილების განაწილება",es:"Distribución de escaños",ja:"議席配分",ko:"의석 배분"},
  "Seats distributed evenly.": {ru:"Места распределены поровну.",de:"Sitze gleichmäßig verteilt.",fr:"Les sièges ont été répartis équitablement.","zh-CN":"席位已平均分配。",id:"Kursi dibagikan secara merata.",ka:"ადგილები თანაბრად განაწილდა.",es:"Los escaños se han distribuido equitativamente.",ja:"議席を均等に配分しました。",ko:"의석이 균등하게 배분되었습니다."},
  "New party": {ru:"Новая партия",de:"Neue Partei",fr:"Nouveau parti","zh-CN":"新政党",id:"Partai baru",ka:"ახალი პარტია",es:"Nuevo partido",ja:"新しい政党",ko:"새 정당"},
  "No parties yet.": {ru:"Партий пока нет.",de:"Noch keine Parteien.",fr:"Aucun parti pour le moment.","zh-CN":"目前没有政党。",id:"Belum ada partai.",ka:"პარტიები ჯერ არ არის.",es:"Todavía no hay partidos.",ja:"政党はまだありません。",ko:"아직 정당이 없습니다."},
  "No parties.": {ru:"Нет партий.",de:"Keine Parteien.",fr:"Aucun parti.","zh-CN":"没有政党。",id:"Tidak ada partai.",ka:"პარტიები არ არის.",es:"No hay partidos.",ja:"政党がありません。",ko:"정당이 없습니다."},
  "Seats": {ru:"Места",de:"Sitze",fr:"Sièges","zh-CN":"席位",id:"Kursi",ka:"ადგილები",es:"Escaños",ja:"議席",ko:"의석"},
  "Unclassified:": {ru:"Не классифицировано:",de:"Nicht klassifiziert:",fr:"Non classé :","zh-CN":"未分类：",id:"Belum diklasifikasikan:",ka:"კლასიფიცირებული არ არის:",es:"Sin clasificar:",ja:"未分類：",ko:"미분류:"},
  "Name": {ru:"Название",de:"Name",fr:"Nom","zh-CN":"名称",id:"Nama",ka:"სახელი",es:"Nombre",ja:"名前",ko:"이름"},
  "Value": {ru:"Значение",de:"Wert",fr:"Valeur","zh-CN":"值",id:"Nilai",ka:"მნიშვნელობა",es:"Valor",ja:"値",ko:"값"},
  "Remove field": {ru:"Удалить поле",de:"Feld entfernen",fr:"Supprimer le champ","zh-CN":"移除字段",id:"Hapus bidang",ka:"ველის წაშლა",es:"Eliminar campo",ja:"項目を削除",ko:"필드 삭제"},
  "No faction": {ru:"Без фракции",de:"Keine Fraktion",fr:"Aucun groupe","zh-CN":"无派系",id:"Tanpa fraksi",ka:"ფრაქციის გარეშე",es:"Sin facción",ja:"会派なし",ko:"파벌 없음"},
  "Orientation": {ru:"Ориентация",de:"Ausrichtung",fr:"Orientation","zh-CN":"取向",id:"Orientasi",ka:"ორიენტაცია",es:"Orientación",ja:"方向性",ko:"성향"},
  "Specify this dimension": {ru:"Указать эту ось",de:"Diese Dimension festlegen",fr:"Préciser cette dimension","zh-CN":"指定此维度",id:"Tentukan dimensi ini",ka:"ამ განზომილების მითითება",es:"Especificar esta dimensión",ja:"この軸を指定する",ko:"이 차원 지정"},
  "Centre": {ru:"Центр",de:"Mitte",fr:"Centre","zh-CN":"中间",id:"Tengah",ka:"ცენტრი",es:"Centro",ja:"中央",ko:"중앙"},
  "Unclassified custom ideologies": {ru:"Неклассифицированные пользовательские идеологии",de:"Nicht klassifizierte benutzerdefinierte Ideologien",fr:"Idéologies personnalisées non classées","zh-CN":"未分类的自定义意识形态",id:"Ideologi khusus yang belum diklasifikasikan",ka:"არაკლასიფიცირებული მორგებული იდეოლოგიები",es:"Ideologías personalizadas sin clasificar",ja:"未分類のカスタム・イデオロギー",ko:"분류되지 않은 사용자 정의 이념"},
  "No ideologies match": {ru:"Подходящих идеологий нет",de:"Keine passenden Ideologien",fr:"Aucune idéologie correspondante","zh-CN":"没有匹配的意识形态",id:"Tidak ada ideologi yang cocok",ka:"შესაბამისი იდეოლოგიები არ მოიძებნა",es:"No hay ideologías coincidentes",ja:"一致するイデオロギーはありません",ko:"일치하는 이념이 없습니다"},
  "Also:": {ru:"Также:",de:"Auch:",fr:"Aussi :","zh-CN":"别名：",id:"Juga:",ka:"ასევე:",es:"También:",ja:"別名：",ko:"다른 이름:"},
  "Sources & references": {ru:"Источники и литература",de:"Quellen und Literatur",fr:"Sources et références","zh-CN":"来源与参考资料",id:"Sumber dan referensi",ka:"წყაროები და მითითებები",es:"Fuentes y referencias",ja:"出典・参考文献",ko:"출처 및 참고문헌"},
  "The original ideology descriptions and historical metadata are preserved. Positions are broad reference classifications; political movements have varied across time and place.": {ru:"Исходные описания идеологий и исторические сведения сохранены. Позиции являются обобщёнными справочными классификациями; политические движения менялись в зависимости от времени и места.",de:"Die ursprünglichen Ideologiebeschreibungen und historischen Metadaten bleiben erhalten. Die Positionen sind grobe Referenzklassifikationen; politische Bewegungen unterschieden sich je nach Zeit und Ort.",fr:"Les descriptions originales des idéologies et les métadonnées historiques sont conservées. Les positions sont des classifications indicatives générales ; les mouvements politiques ont varié selon les époques et les lieux.","zh-CN":"原有意识形态描述和历史元数据均予以保留。立场属于概括性的参考分类；政治运动会随时代和地区而变化。",id:"Deskripsi ideologi asli dan metadata historis dipertahankan. Posisi merupakan klasifikasi referensi umum; gerakan politik berbeda menurut waktu dan tempat.",ka:"იდეოლოგიების თავდაპირველი აღწერები და ისტორიული მეტამონაცემები შენარჩუნებულია. პოზიციები ზოგადი საცნობარო კლასიფიკაციაა; პოლიტიკური მოძრაობები დროისა და ადგილის მიხედვით იცვლებოდა.",es:"Se conservan las descripciones originales de las ideologías y los metadatos históricos. Las posiciones son clasificaciones orientativas generales; los movimientos políticos han variado según la época y el lugar.",ja:"元のイデオロギー説明と歴史的メタデータは保持されています。各位置は大まかな参照分類であり、政治運動は時代や地域によって異なります。",ko:"이념의 원래 설명과 역사적 메타데이터는 보존됩니다. 입장은 대략적인 참고 분류이며 정치 운동은 시대와 지역에 따라 달라졌습니다."},
  "No independent deputies.": {ru:"Нет независимых депутатов.",de:"Keine unabhängigen Abgeordneten.",fr:"Aucun député indépendant.","zh-CN":"没有独立议员。",id:"Tidak ada anggota parlemen independen.",ka:"დამოუკიდებელი დეპუტატები არ არის.",es:"No hay diputados independientes.",ja:"無所属議員はいません。",ko:"무소속 의원이 없습니다."},
  "About this simulator": {ru:"Об этом симуляторе",de:"Über diesen Simulator",fr:"À propos du simulateur","zh-CN":"关于本模拟器",id:"Tentang simulator ini",ka:"სიმულატორის შესახებ",es:"Acerca de este simulador",ja:"このシミュレーターについて",ko:"시뮬레이터 정보"},
  "Small councils to very large assemblies (up to 20,000).": {ru:"От небольших советов до крупных собраний (до 20 000 мест).",de:"Von kleinen Räten bis zu sehr großen Versammlungen (bis zu 20.000 Sitze).",fr:"Des petits conseils aux très grandes assemblées (jusqu’à 20 000 sièges).","zh-CN":"从小型委员会到大型议会（最多 20,000 个席位）。",id:"Dari dewan kecil hingga majelis besar (hingga 20.000 kursi).",ka:"პატარა საბჭოებიდან დიდ ასამბლეებამდე (20 000-მდე ადგილი).",es:"Desde pequeños consejos hasta grandes asambleas (hasta 20.000 escaños).",ja:"小規模な評議会から大規模な議会まで（最大20,000議席）。",ko:"소규모 위원회부터 대규모 의회까지(최대 20,000석)."},
  "None specified": {ru:"Не указано",de:"Nicht angegeben",fr:"Non spécifié","zh-CN":"未指定",id:"Tidak ditentukan",ka:"მითითებული არ არის",es:"No especificado",ja:"未指定",ko:"지정되지 않음"},
  "Rescale parties proportionally": {ru:"Перераспределить места пропорционально",de:"Parteien proportional neu skalieren",fr:"Redimensionner les partis proportionnellement","zh-CN":"按比例重新分配政党席位",id:"Sesuaikan partai secara proporsional",ka:"პარტიების პროპორციული გადანაწილება",es:"Reescalar los partidos proporcionalmente",ja:"政党の議席を比例配分し直す",ko:"정당 의석을 비례적으로 재조정"},
  "Refuse (strict)": {ru:"Отказать (строго)",de:"Ablehnen (streng)",fr:"Refuser (strict)","zh-CN":"拒绝（严格模式）",id:"Tolak (ketat)",ka:"უარყოფა (მკაცრად)",es:"Rechazar (estricto)",ja:"拒否（厳格）",ko:"거부(엄격)"},
  "Re-sort seats into party blocks": {ru:"Перегруппировать места по партиям",de:"Sitze wieder in Parteiblöcke sortieren",fr:"Réorganiser les sièges en blocs de partis","zh-CN":"重新按政党排列席位",id:"Urutkan ulang kursi ke dalam blok partai",ka:"ადგილების პარტიულ ბლოკებად ხელახლა დალაგება",es:"Reordenar los escaños en bloques de partidos",ja:"議席を政党ブロックに再配置",ko:"의석을 정당 블록으로 재정렬"},
  "How many": {ru:"Количество",de:"Anzahl",fr:"Combien","zh-CN":"数量",id:"Berapa banyak",ka:"რამდენი",es:"Cuántos",ja:"人数",ko:"수량"},
  "Behaviour": {ru:"Поведение",de:"Verhalten",fr:"Comportement","zh-CN":"行为",id:"Perilaku",ka:"ქცევა",es:"Comportamiento",ja:"行動",ko:"행동"},
  "Follows own ideology": {ru:"Следует собственной идеологии",de:"Folgt der eigenen Ideologie",fr:"Suit sa propre idéologie","zh-CN":"遵循自身意识形态",id:"Mengikuti ideologinya sendiri",ka:"საკუთარ იდეოლოგიას მიჰყვება",es:"Sigue su propia ideología",ja:"自身のイデオロギーに従う",ko:"자신의 이념을 따름"},
  "Always For": {ru:"Всегда за",de:"Immer dafür",fr:"Toujours pour","zh-CN":"始终赞成",id:"Selalu setuju",ka:"ყოველთვის მომხრე",es:"Siempre a favor",ja:"常に賛成",ko:"항상 찬성"},
  "Always Against": {ru:"Всегда против",de:"Immer dagegen",fr:"Toujours contre","zh-CN":"始终反对",id:"Selalu menolak",ka:"ყოველთვის წინააღმდეგი",es:"Siempre en contra",ja:"常に反対",ko:"항상 반대"},
  "Always Abstain": {ru:"Всегда воздерживается",de:"Enthält sich immer",fr:"S’abstient toujours","zh-CN":"始终弃权",id:"Selalu abstain",ka:"ყოველთვის თავს იკავებს",es:"Siempre se abstiene",ja:"常に棄権",ko:"항상 기권"},
  "Names (optional, one per line — overrides the count)": {ru:"Имена (необязательно, по одному в строке — заменяют число)",de:"Namen (optional, einer pro Zeile – überschreibt die Anzahl)",fr:"Noms (facultatif, un par ligne — remplace le nombre)","zh-CN":"姓名（可选，每行一个——将覆盖人数）",id:"Nama (opsional, satu per baris — menggantikan jumlah)",ka:"სახელები (არასავალდებულო, თითო ხაზზე ერთი — რაოდენობას ჩაანაცვლებს)",es:"Nombres (opcional, uno por línea; sustituye la cantidad)",ja:"名前（任意、1行に1名 — 人数の指定を上書き）",ko:"이름(선택 사항, 한 줄에 하나 — 인원수를 대체)"},
  "Designation": {ru:"Статус",de:"Bezeichnung",fr:"Désignation","zh-CN":"身份标记",id:"Penetapan",ka:"სტატუსი",es:"Designación",ja:"区分",ko:"지정"},
  "Own ideology": {ru:"Собственная идеология",de:"Eigene Ideologie",fr:"Propre idéologie","zh-CN":"自身意识形态",id:"Ideologi sendiri",ka:"საკუთარი იდეოლოგია",es:"Ideología propia",ja:"自身のイデオロギー",ko:"자체 이념"},
  "Affiliation / description": {ru:"Принадлежность / описание",de:"Zugehörigkeit / Beschreibung",fr:"Affiliation / description","zh-CN":"所属/描述",id:"Afiliasi / deskripsi",ka:"კუთვნილება / აღწერა",es:"Afiliación / descripción",ja:"所属／説明",ko:"소속 / 설명"},
  "No independent deputies.": {ru:"Нет независимых депутатов.",de:"Keine unabhängigen Abgeordneten.",fr:"Aucun député indépendant.","zh-CN":"没有独立议员。",id:"Tidak ada anggota parlemen independen.",ka:"დამოუკიდებელი დეპუტატები არ არის.",es:"No hay diputados independientes.",ja:"無所属議員はいません。",ko:"무소속 의원이 없습니다."},
  "Search independents…": {ru:"Поиск независимых депутатов…",de:"Unabhängige Abgeordnete suchen …",fr:"Rechercher des indépendants…","zh-CN":"搜索独立议员…",id:"Cari anggota independen…",ka:"დამოუკიდებელი დეპუტატების ძიება…",es:"Buscar independientes…",ja:"無所属議員を検索…",ko:"무소속 의원 검색…"},
  "Highlight in chamber": {ru:"Выделить в парламенте",de:"Im Plenum hervorheben",fr:"Mettre en évidence dans l’assemblée","zh-CN":"在议会中突出显示",id:"Sorot di parlemen",ka:"პარლამენტში გამოკვეთა",es:"Resaltar en la cámara",ja:"議場で強調表示",ko:"의회에서 강조 표시"},
  "Search deputies…": {ru:"Поиск депутатов…",de:"Abgeordnete suchen …",fr:"Rechercher des députés…","zh-CN":"搜索议员…",id:"Cari anggota parlemen…",ka:"დეპუტატების ძიება…",es:"Buscar diputados…",ja:"議員を検索…",ko:"의원 검색…"},
  "Party line (fallback)": {ru:"Линия партии (резервная)",de:"Parteilinie (Fallback)",fr:"Ligne du parti (repli)","zh-CN":"政党立场（备用）",id:"Garis partai (cadangan)",ka:"პარტიის ხაზი (სარეზერვო)",es:"Línea del partido (alternativa)",ja:"政党方針（代替）",ko:"정당 노선(대체)"},
  "Party line": {ru:"Линия партии",de:"Parteilinie",fr:"Ligne du parti","zh-CN":"政党立场",id:"Garis partai",ka:"პარტიის ხაზი",es:"Línea del partido",ja:"政党方針",ko:"정당 노선"},
  "Socialist & Communist Traditions": {ru:"Социалистические и коммунистические традиции",de:"Sozialistische und kommunistische Traditionen",fr:"Traditions socialistes et communistes","zh-CN":"社会主义与共产主义传统",id:"Tradisi sosialis dan komunis",ka:"სოციალისტური და კომუნისტური ტრადიციები",es:"Tradiciones socialistas y comunistas",ja:"社会主義・共産主義の伝統",ko:"사회주의 및 공산주의 전통"},
  "Nationalist & Sovereigntist Traditions": {ru:"Националистические и суверенистские традиции",de:"Nationalistische und souveränistische Traditionen",fr:"Traditions nationalistes et souverainistes","zh-CN":"民族主义与主权主义传统",id:"Tradisi nasionalis dan kedaulatan",ka:"ნაციონალისტური და სუვერენისტული ტრადიციები",es:"Tradiciones nacionalistas y soberanistas",ja:"ナショナリズム・主権主義の伝統",ko:"민족주의 및 주권주의 전통"},
  "Democratic & Pluralist Socialist Traditions": {ru:"Демократические и плюралистические социалистические традиции",de:"Demokratische und pluralistische sozialistische Traditionen",fr:"Traditions socialistes démocratiques et pluralistes","zh-CN":"民主与多元社会主义传统",id:"Tradisi sosialis demokratis dan pluralis",ka:"დემოკრატიული და პლურალისტური სოციალისტური ტრადიციები",es:"Tradiciones socialistas democráticas y pluralistas",ja:"民主的・多元主義的社会主義の伝統",ko:"민주적·다원주의적 사회주의 전통"},
  "Authoritarian & State-Communist Traditions": {ru:"Авторитарные и государственно-коммунистические традиции",de:"Autoritäre und staatskommunistische Traditionen",fr:"Traditions autoritaires et communistes étatiques","zh-CN":"威权主义与国家共产主义传统",id:"Tradisi otoriter dan komunis negara",ka:"ავტორიტარული და სახელმწიფო-კომუნისტური ტრადიციები",es:"Tradiciones autoritarias y del comunismo de Estado",ja:"権威主義的・国家共産主義の伝統",ko:"권위주의 및 국가공산주의 전통"},
  "Fascist & Ultranationalist Traditions": {ru:"Фашистские и ультранационалистические традиции",de:"Faschistische und ultranationalistische Traditionen",fr:"Traditions fascistes et ultranationalistes","zh-CN":"法西斯主义与极端民族主义传统",id:"Tradisi fasis dan ultranasionalis",ka:"ფაშისტური და ულტრანაციონალისტური ტრადიციები",es:"Tradiciones fascistas y ultranacionalistas",ja:"ファシズム・超国家主義の伝統",ko:"파시즘 및 초국가주의 전통"}
};

Object.assign(rows, {
// Navigation, panels, chamber controls and party/deputy forms.
"Parliament":{
ru:"Парламент",de:"Parlament",fr:"Parlement","zh-CN":"议会",id:"Parlemen",ka:"პარლამენტი",es:"Parlamento",ja:"議会",ko:"의회"},
"Overview":{
ru:"Обзор",de:"Übersicht",fr:"Aperçu","zh-CN":"概览",id:"Ikhtisar",ka:"მიმოხილვა",es:"Resumen",ja:"概要",ko:"개요"},
"Voting simulator":{
ru:"Симулятор голосования",de:"Abstimmungssimulator",fr:"Simulateur de vote","zh-CN":"投票模拟器",id:"Simulator pemungutan suara",ka:"კენჭისყრის სიმულატორი",es:"Simulador de votaciones",ja:"投票シミュレーター",ko:"투표 시뮬레이터"},
"Manage projects":{
ru:"Управление проектами",de:"Projekte verwalten",fr:"Gérer les projets","zh-CN":"管理项目",id:"Kelola proyek",ka:"პროექტების მართვა",es:"Administrar proyectos",ja:"プロジェクト管理",ko:"프로젝트 관리"},
"Collapse side panel":{
ru:"Свернуть боковую панель",de:"Seitenleiste einklappen",fr:"Réduire le panneau latéral","zh-CN":"折叠侧边栏",id:"Ciutkan panel samping",ka:"გვერდითი პანელის ჩაკეცვა",es:"Contraer el panel lateral",ja:"サイドパネルを折りたたむ",ko:"사이드 패널 접기"},
"Expand side panel":{
ru:"Развернуть боковую панель",de:"Seitenleiste ausklappen",fr:"Développer le panneau latéral","zh-CN":"展开侧边栏",id:"Perluas panel samping",ka:"გვერდითი პანელის გაშლა",es:"Expandir el panel lateral",ja:"サイドパネルを展開する",ko:"사이드 패널 펼치기"},
"Toggle side panel":{
ru:"Показать или скрыть боковую панель",de:"Seitenleiste umschalten",fr:"Afficher ou masquer le panneau latéral","zh-CN":"切换侧边栏",id:"Tampilkan/sembunyikan panel samping",ka:"გვერდითი პანელის ჩვენება/დამალვა",es:"Mostrar u ocultar el panel lateral",ja:"サイドパネルの表示を切り替える",ko:"사이드 패널 표시 전환"},
"Toggle dark / light mode":{
ru:"Переключить тёмную / светлую тему",de:"Dunkel-/Hellmodus umschalten",fr:"Basculer entre le mode sombre et clair","zh-CN":"切换深色/浅色模式",id:"Ganti mode gelap/terang",ka:"მუქი / ნათელი რეჟიმის გადართვა",es:"Cambiar entre modo oscuro y claro",ja:"ダーク／ライトモードを切り替える",ko:"다크/라이트 모드 전환"},
"Toggle theme":{
ru:"Сменить тему",de:"Design umschalten",fr:"Changer de thème","zh-CN":"切换主题",id:"Ganti tema",ka:"თემის გადართვა",es:"Cambiar tema",ja:"テーマを切り替える",ko:"테마 전환"},
"Parties with coalition rings":{
ru:"Партии с кольцами коалиций",de:"Parteien mit Koalitionsringen",fr:"Partis avec anneaux de coalition","zh-CN":"显示带有联盟环的政党",id:"Partai dengan cincin koalisi",ka:"პარტიები კოალიციის რგოლებით",es:"Partidos con anillos de coalición",ja:"連立リング付きの政党",ko:"연정 링이 있는 정당"},
"Factions, parties and coalitions":{
ru:"Фракции, партии и коалиции",de:"Fraktionen, Parteien und Koalitionen",fr:"Factions, partis et coalitions","zh-CN":"派系、政党与联盟",id:"Faksi, partai, dan koalisi",ka:"ფრაქციები, პარტიები და კოალიციები",es:"Facciones, partidos y coaliciones",ja:"派閥・政党・連合",ko:"파벌, 정당, 연합"},
"Toggle the vote result overlay":{
ru:"Показать или скрыть результаты голосования",de:"Abstimmungsergebnis ein-/ausblenden",fr:"Afficher ou masquer le résultat du vote","zh-CN":"切换投票结果覆盖层",id:"Tampilkan/sembunyikan hasil pemungutan suara",ka:"კენჭისყრის შედეგების ფენის ჩვენება/დამალვა",es:"Mostrar u ocultar la capa de resultados",ja:"投票結果の表示を切り替える",ko:"투표 결과 오버레이 전환"},
"Manual seating is locked. Use Auto-arrange in the Parliament tab to restore party blocks.":{
ru:"Ручная рассадка заблокирована. Используйте «Автоматическое размещение» на вкладке «Парламент», чтобы восстановить блоки партий.",
de:"Die manuelle Sitzordnung ist gesperrt. Verwenden Sie „Automatisch anordnen“ im Reiter Parlament, um die Parteiblöcke wiederherzustellen.",
fr:"Le placement manuel est verrouillé. Utilisez « Disposition automatique » dans l’onglet Parlement pour rétablir les blocs des partis.",
"zh-CN":"手动排座已锁定。请在“议会”选项卡中使用“自动排列”以恢复政党区块。",
id:"Penataan kursi manual terkunci. Gunakan Atur otomatis pada tab Parlemen untuk memulihkan blok partai.",
ka:"ხელით განლაგება დაბლოკილია. პარტიების ბლოკების აღსადგენად გამოიყენეთ „ავტომატური განლაგება“ პარლამენტის ჩანართში.",
es:"La disposición manual está bloqueada. Use «Organizar automáticamente» en la pestaña Parlamento para restaurar los bloques de partidos.",
ja:"手動座席配置はロックされています。政党ごとの配置に戻すには「議会」タブの「自動配置」を使用してください。",
ko:"수동 좌석 배치가 잠겨 있습니다. 정당별 블록을 복원하려면 의회 탭에서 자동 정렬을 사용하세요."
},
"· seat outline = party colour":{
ru:"· контур места = цвет партии",de:"· Sitzumrandung = Parteifarbe",fr:"· contour du siège = couleur du parti","zh-CN":"· 席位边框 = 政党颜色",id:"· garis kursi = warna partai",ka:"· ადგილის კონტური = პარტიის ფერი",es:"· contorno del escaño = color del partido",ja:"· 座席の輪郭 = 政党カラー",ko:"· 좌석 윤곽 = 정당 색상"},
"vacant":{
ru:"Свободно",de:"Frei",fr:"Vacant","zh-CN":"空缺",id:"Kosong",ka:"თავისუფალი",es:"Vacante",ja:"空席",ko:"공석"},
"No deputies yet — create parties in the Parties tab.":{
ru:"Пока нет депутатов — создайте партии на вкладке «Партии».",
de:"Noch keine Abgeordneten – erstellen Sie Parteien im Reiter Parteien.",
fr:"Aucun député pour le moment — créez des partis dans l’onglet Partis.",
"zh-CN":"目前还没有议员——请在“政党”选项卡中创建政党。",
id:"Belum ada anggota parlemen — buat partai pada tab Partai.",
ka:"დეპუტატები ჯერ არ არიან — შექმენით პარტიები „პარტიების“ ჩანართში.",
es:"Todavía no hay diputados: cree partidos en la pestaña Partidos.",
ja:"議員がまだいません。「政党」タブで政党を作成してください。",
ko:"아직 의원이 없습니다. 정당 탭에서 정당을 만드세요."
},
"Coalition colour (ring)":{
ru:"Цвет коалиции (кольцо)",de:"Koalitionsfarbe (Ring)",fr:"Couleur de la coalition (anneau)","zh-CN":"联盟颜色（环）",id:"Warna koalisi (cincin)",ka:"კოალიციის ფერი (რგოლი)",es:"Color de la coalición (anillo)",ja:"連合カラー（リング）",ko:"연합 색상(링)"},
"Create parties first.":{
ru:"Сначала создайте партии.",de:"Erstellen Sie zuerst Parteien.",fr:"Créez d’abord des partis.","zh-CN":"请先创建政党。",id:"Buat partai terlebih dahulu.",ka:"ჯერ შექმენით პარტიები.",es:"Primero cree partidos.",ja:"先に政党を作成してください。",ko:"먼저 정당을 만드세요."},
"Orientation (optional)":{
ru:"Ориентация (необязательно)",de:"Ausrichtung (optional)",fr:"Orientation (facultative)","zh-CN":"政治取向（可选）",id:"Orientasi (opsional)",ka:"ორიენტაცია (არასავალდებულო)",es:"Orientación (opcional)",ja:"方向性（任意）",ko:"성향(선택 사항)"},
"Ideology (optional)":{
ru:"Идеология (необязательно)",de:"Ideologie (optional)",fr:"Idéologie (facultatif)","zh-CN":"意识形态（可选）",id:"Ideologi (opsional)",ka:"იდეოლოგია (არასავალდებულო)",es:"Ideología (opcional)",ja:"イデオロギー（任意）",ko:"이념(선택 사항)"},
"Visual colour picker":{
ru:"Визуальный выбор цвета",de:"Visuelle Farbauswahl",fr:"Sélecteur visuel de couleur","zh-CN":"可视化颜色选择器",id:"Pemilih warna visual",ka:"ფერის ვიზუალური არჩევა",es:"Selector visual de color",ja:"ビジュアルカラーピッカー",ko:"시각적 색상 선택기"},
"HEX colour":{
ru:"Цвет HEX",de:"HEX-Farbe",fr:"Couleur HEX","zh-CN":"HEX 颜色",id:"Warna HEX",ka:"HEX ფერი",es:"Color HEX",ja:"HEXカラー",ko:"HEX 색상"},
"Type any format":{
ru:"Введите значение в любом формате",de:"Beliebiges Format eingeben",fr:"Saisissez n’importe quel format","zh-CN":"输入任意格式",id:"Ketik format apa pun",ka:"შეიყვანეთ ნებისმიერი ფორმატით",es:"Escriba en cualquier formato",ja:"任意の形式で入力",ko:"아무 형식으로 입력"},
"Suggested:":{
ru:"Предлагается:",de:"Vorgeschlagen:",fr:"Suggestion :","zh-CN":"建议：",id:"Disarankan:",ka:"შემოთავაზებულია:",es:"Sugerido:",ja:"おすすめ:",ko:"추천:"},
"Progressive Faction":{
ru:"Прогрессивная фракция",de:"Progressive Fraktion",fr:"Faction progressiste","zh-CN":"进步派系",id:"Faksi progresif",ka:"პროგრესული ფრაქცია",es:"Facción progresista",ja:"進歩派閥",ko:"진보 파벌"},
"Abbr. (optional)":{
ru:"Сокращение (необязательно)",de:"Abkürzung (optional)",fr:"Abrév. (facultatif)","zh-CN":"缩写（可选）",id:"Singkatan (opsional)",ka:"აბრევიატურა (არასავალდებულო)",es:"Abrev. (opcional)",ja:"略称（任意）",ko:"약칭(선택 사항)"},
"Suggested shades are derived from the party colour; you can pick anything.":{
ru:"Предлагаемые оттенки рассчитаны на основе цвета партии; вы можете выбрать любой цвет.",
de:"Die vorgeschlagenen Farbtöne leiten sich von der Parteifarbe ab; Sie können beliebige Farben wählen.",
fr:"Les nuances proposées sont dérivées de la couleur du parti ; vous pouvez choisir n’importe quelle couleur.",
"zh-CN":"建议色调根据政党颜色生成；您也可以自由选择任何颜色。",
id:"Nuansa yang disarankan berasal dari warna partai; Anda bebas memilih warna apa pun.",
ka:"შემოთავაზებული ტონები პარტიის ფერზეა დაფუძნებული; შეგიძლიათ ნებისმიერი ფერი აირჩიოთ.",
es:"Los tonos sugeridos se derivan del color del partido; puede elegir cualquier otro.",
ja:"推奨色は政党カラーを基にしていますが、自由に選択できます。",
ko:"추천 색조는 정당 색상에서 파생되지만 원하는 색상을 선택할 수 있습니다."
},
"Ideology (optional — independent of the party's ideology)":{
ru:"Идеология (необязательно — не зависит от идеологии партии)",de:"Ideologie (optional – unabhängig von der Parte ideologie)",fr:"Idéologie (facultative — indépendante de celle du parti)","zh-CN":"意识形态（可选——独立于政党的意识形态）",id:"Ideologi (opsional — terpisah dari ideologi partai)",ka:"იდეოლოგია (არასავალდებულო — პარტიის იდეოლოგიისგან დამოუკიდებელი)",es:"Ideología (opcional: independiente de la del partido)",ja:"イデオロギー（任意。政党のイデオロギーとは独立）",ko:"이념(선택 사항 — 정당 이념과 별개)"},
"None — assign later":{
ru:"Нет — назначить позже",de:"Keine – später zuweisen",fr:"Aucune — attribuer plus tard","zh-CN":"无——稍后分配",id:"Tidak ada — tetapkan nanti",ka:"არცერთი — მოგვიანებით მიენიჭოს",es:"Ninguna: asignar más tarde",ja:"なし — 後で割り当て",ko:"없음 — 나중에 지정"},
"Faction leader (optional)":{
ru:"Лидер фракции (необязательно)",de:"Fraktionsvorsitz (optional)",fr:"Chef de faction (facultatif)","zh-CN":"派系领袖（可选）",id:"Pemimpin faksi (opsional)",ka:"ფრაქციის ლიდერი (არასავალდებულო)",es:"Líder de la facción (opcional)",ja:"派閥リーダー（任意）",ko:"파벌 지도자(선택 사항)"},
"not in a faction":{
ru:"вне фракции",de:"keiner Fraktion zugehörig",fr:"sans faction","zh-CN":"不属于任何派系",id:"bukan anggota faksi",ka:"ფრაქციის გარეშე",es:"sin facción",ja:"派閥なし",ko:"파벌 없음"},
"Assign deputies":{
ru:"Назначить депутатов",de:"Abgeordnete zuweisen",fr:"Attribuer des députés","zh-CN":"分配议员",id:"Tetapkan anggota parlemen",ka:"დეპუტატების მინიჭება",es:"Asignar diputados",ja:"議員を割り当てる",ko:"의원 배정"},
"Search deputies of this party…":{
ru:"Поиск депутатов этой партии…",de:"Abgeordnete dieser Partei suchen …",fr:"Rechercher les députés de ce parti…","zh-CN":"搜索该政党的议员…",id:"Cari anggota parlemen partai ini…",ka:"ამ პარტიის დეპუტატების ძიება…",es:"Buscar diputados de este partido…",ja:"この政党の議員を検索…",ko:"이 정당의 의원 검색…"},
"Specify this dimension":{
ru:"Указать это измерение",de:"Diese Dimension festlegen",fr:"Préciser cette dimension","zh-CN":"指定此维度",id:"Tentukan dimensi ini",ka:"ამ განზომილების მითითება",es:"Especificar esta dimensión",ja:"この次元を指定",ko:"이 차원 지정"},
"Unclassified custom ideologies":{
ru:"Неклассифицированные пользовательские идеологии",de:"Nicht klassifizierte benutzerdefinierte Ideologien",fr:"Idéologies personnalisées non classées","zh-CN":"未分类的自定义意识形态",id:"Ideologi kustom yang belum diklasifikasikan",ka:"არაკლასიფიცირებული მორგებული იდეოლოგიები",es:"Ideologías personalizadas sin clasificar",ja:"未分類のカスタムイデオロギー",ko:"분류되지 않은 사용자 정의 이념"},
"No ideologies match":{
ru:"Нет подходящих идеологий",de:"Keine passenden Ideologien",fr:"Aucune idéologie correspondante","zh-CN":"没有匹配的意识形态",id:"Tidak ada ideologi yang cocok",ka:"შესაბამისი იდეოლოგია ვერ მოიძებნა",es:"No hay ideologías coincidentes",ja:"一致するイデオロギーがありません",ko:"일치하는 이념이 없습니다"},
"Also:":{
ru:"Также:",de:"Auch:",fr:"Aussi :","zh-CN":"亦称：",id:"Juga:",ka:"ასევე:",es:"También:",ja:"別名:",ko:"다른 이름:"},
"Sources & references":{
ru:"Источники и литература",de:"Quellen und Literatur",fr:"Sources et références","zh-CN":"来源与参考资料",id:"Sumber dan referensi",ka:"წყაროები და ლიტერატურა",es:"Fuentes y referencias",ja:"出典・参考文献",ko:"출처 및 참고문헌"},
});


Object.assign(rows, {
// Parliament settings, government roles and independent deputies.
"Governing coalition (optional)":{
ru:"Правящая коалиция (необязательно)",de:"Regierungskoalition (optional)",fr:"Coalition au pouvoir (facultatif)","zh-CN":"执政联盟（可选）",id:"Koalisi pemerintahan (opsional)",ka:"მმართველი კოალიცია (არასავალდებულო)",es:"Coalición de gobierno (opcional)",ja:"与党連合（任意）",ko:"집권 연합(선택 사항)"},
"Informational. Designations below are set manually and never follow coalition membership automatically.":{
ru:"Информационный параметр. Назначения ниже задаются вручную и не меняются автоматически в зависимости от членства в коалиции.",
de:"Nur zur Information. Die folgenden Funktionen werden manuell festgelegt und ändern sich nicht automatisch mit der Koalitionszugehörigkeit.",
fr:"À titre informatif. Les désignations ci-dessous sont définies manuellement et ne suivent jamais automatiquement l’appartenance à une coalition.",
"zh-CN":"仅供参考。以下职务由用户手动设置，不会根据联盟成员身份自动变化。",
id:"Informasi saja. Penetapan di bawah diatur secara manual dan tidak otomatis mengikuti keanggotaan koalisi.",
ka:"საინფორმაციოა. ქვემოთ მოცემული სტატუსები ხელით განისაზღვრება და კოალიციაში წევრობას ავტომატურად არ მიჰყვება.",
es:"Solo informativo. Las designaciones siguientes se establecen manualmente y nunca siguen automáticamente la pertenencia a una coalición.",
ja:"参考情報です。以下の役職は手動で設定され、連合への所属に自動的に連動しません。",
ko:"정보 제공용입니다. 아래 직책은 수동으로 설정되며 연합 소속에 따라 자동으로 바뀌지 않습니다."
},
"None specified":{
ru:"Не указано",de:"Nicht angegeben",fr:"Non spécifié","zh-CN":"未指定",id:"Belum ditentukan",ka:"მითითებული არ არის",es:"No especificado",ja:"指定なし",ko:"지정되지 않음"},
"Small councils to very large assemblies (up to 20,000).":{
ru:"От небольших советов до крупных собраний (до 20 000 мест).",de:"Von kleinen Räten bis zu sehr großen Versammlungen (bis zu 20.000 Sitze).",fr:"Des petits conseils aux très grandes assemblées (jusqu’à 20 000 sièges).","zh-CN":"从小型委员会到大型议会（最多20,000席）。",id:"Dari dewan kecil hingga majelis sangat besar (hingga 20.000 kursi).",ka:"მცირე საბჭოებიდან ძალიან დიდ ასამბლეებამდე (20 000-მდე ადგილი).",es:"Desde pequeños consejos hasta grandes asambleas (hasta 20.000 escaños).",ja:"小規模な評議会から大規模な議会まで（最大20,000議席）。",ko:"소규모 의회부터 대규모 의회까지(최대 20,000석)."},
"Parties are scaled down proportionally (largest remainder).":{
ru:"Число мест партий пропорционально уменьшается (метод наибольших остатков).",de:"Die Sitzzahlen der Parteien werden proportional reduziert (Hare-Niemeyer-Verfahren).",fr:"Le nombre de sièges des partis est réduit proportionnellement (méthode des plus forts restes).","zh-CN":"按比例缩减各政党的席位（最大余数法）。",id:"Jumlah kursi partai dikurangi secara proporsional (metode sisa terbesar).",ka:"პარტიების ადგილები პროპორციულად მცირდება (უდიდესი ნაშთის მეთოდი).",es:"Los escaños de los partidos se reducen proporcionalmente (método de restos mayores).",ja:"政党の議席数を比例配分で縮小します（最大剰余方式）。",ko:"정당 의석을 비례적으로 축소합니다(최대 잔여 방식)."},
"Resize is refused until you free seats manually.":{
ru:"Изменение размера запрещено, пока вы вручную не освободите места.",de:"Eine Verkleinerung wird abgelehnt, bis Sie manuell Sitze freigeben.",fr:"La réduction est refusée tant que vous n’avez pas libéré des sièges manuellement.","zh-CN":"在手动释放席位之前，系统不会调整规模。",id:"Perubahan ukuran ditolak sampai Anda mengosongkan kursi secara manual.",ka:"ზომის შეცვლა უარყოფილია, სანამ ადგილებს ხელით არ გაათავისუფლებთ.",es:"No se permite reducir el tamaño hasta que libere escaños manualmente.",ja:"手動で議席を空けるまで、規模の縮小は拒否されます。",ko:"수동으로 좌석을 비우기 전까지 규모를 줄일 수 없습니다."},
"Rescale parties proportionally":{
ru:"Перераспределить места партий пропорционально",de:"Parteien proportional neu skalieren",fr:"Redimensionner les partis proportionnellement","zh-CN":"按比例重新分配政党席位",id:"Skalakan partai secara proporsional",ka:"პარტიების პროპორციულად გადანაწილება",es:"Redimensionar los partidos proporcionalmente",ja:"政党の議席を比例的に再調整",ko:"정당 의석 비례 재조정"},
"Refuse (strict)":{
ru:"Отказать (строго)",de:"Ablehnen (streng)",fr:"Refuser (strict)","zh-CN":"拒绝（严格）",id:"Tolak (ketat)",ka:"უარყოფა (მკაცრი)",es:"Rechazar (estricto)",ja:"拒否（厳格）",ko:"거부(엄격)"},
"Re-sort seats into party blocks":{
ru:"Пересортировать места по партийным блокам",de:"Sitze wieder nach Parteiblöcken sortieren",fr:"Réorganiser les sièges par blocs de partis","zh-CN":"按政党区块重新排列席位",id:"Urutkan kembali kursi ke dalam blok partai",ka:"ადგილების პარტიულ ბლოკებად ხელახლა დალაგება",es:"Reordenar los escaños en bloques de partidos",ja:"議席を政党ブロックごとに並べ直す",ko:"정당 블록별로 좌석 재정렬"},
"How many":{
ru:"Количество",de:"Wie viele",fr:"Combien","zh-CN":"数量",id:"Berapa banyak",ka:"რამდენი",es:"Cuántos",ja:"人数",ko:"인원 수"},
"Behaviour":{
ru:"Поведение",de:"Verhalten",fr:"Comportement","zh-CN":"行为",id:"Perilaku",ka:"ქცევა",es:"Comportamiento",ja:"行動",ko:"행동"},
"Follows own ideology":{
ru:"Следует собственной идеологии",de:"Folgt der eigenen Ideologie",fr:"Suit sa propre idéologie","zh-CN":"遵循自身意识形态",id:"Mengikuti ideologinya sendiri",ka:"საკუთარ იდეოლოგიას მიჰყვება",es:"Sigue su propia ideología",ja:"自身のイデオロギーに従う",ko:"자신의 이념을 따름"},
"Always For":{
ru:"Всегда «За»",de:"Immer Dafür",fr:"Toujours pour","zh-CN":"始终赞成",id:"Selalu Setuju",ka:"ყოველთვის მომხრე",es:"Siempre a favor",ja:"常に賛成",ko:"항상 찬성"},
"Always Against":{
ru:"Всегда «Против»",de:"Immer Dagegen",fr:"Toujours contre","zh-CN":"始终反对",id:"Selalu Menolak",ka:"ყოველთვის წინააღმდეგი",es:"Siempre en contra",ja:"常に反対",ko:"항상 반대"},
"Always Abstain":{
ru:"Всегда воздерживается",de:"Immer Enthaltung",fr:"Toujours abstention","zh-CN":"始终弃权",id:"Selalu abstain",ka:"ყოველთვის თავს იკავებს",es:"Siempre se abstiene",ja:"常に棄権",ko:"항상 기권"},
"Names (optional, one per line — overrides the count)":{
ru:"Имена (необязательно, по одному в строке — заменяют количество)",de:"Namen (optional, einer pro Zeile – überschreibt die Anzahl)",fr:"Noms (facultatif, un par ligne — remplace le nombre)","zh-CN":"姓名（可选，每行一个——将覆盖数量）",id:"Nama (opsional, satu per baris — menggantikan jumlah)",ka:"სახელები (არასავალდებულო, თითოეული ახალ ხაზზე — ცვლის რაოდენობას)",es:"Nombres (opcional, uno por línea: sustituye la cantidad)",ja:"名前（任意、1行に1人 — 人数の指定より優先）",ko:"이름(선택 사항, 한 줄에 하나씩 — 인원 수 설정을 대체)"},
"Designation":{
ru:"Статус",de:"Funktion",fr:"Désignation","zh-CN":"职务",id:"Jabatan",ka:"სტატუსი",es:"Cargo",ja:"役職",ko:"직책"},
"Own ideology":{
ru:"Собственная идеология",de:"Eigene Ideologie",fr:"Propre idéologie","zh-CN":"个人意识形态",id:"Ideologi sendiri",ka:"საკუთარი იდეოლოგია",es:"Ideología propia",ja:"独自のイデオロギー",ko:"개인 이념"},
"Affiliation / description":{
ru:"Принадлежность / описание",de:"Zugehörigkeit / Beschreibung",fr:"Affiliation / description","zh-CN":"派别/描述",id:"Afiliasi / deskripsi",ka:"კუთვნილება / აღწერა",es:"Afiliación / descripción",ja:"所属／説明",ko:"소속 / 설명"},
"Search independents…":{
ru:"Поиск независимых депутатов…",de:"Unabhängige suchen …",fr:"Rechercher les indépendants…","zh-CN":"搜索独立议员…",id:"Cari anggota independen…",ka:"დამოუკიდებელი დეპუტატების ძიება…",es:"Buscar independientes…",ja:"無所属議員を検索…",ko:"무소속 의원 검색…"},
"No independent deputies.":{
ru:"Нет независимых депутатов.",de:"Keine unabhängigen Abgeordneten.",fr:"Aucun député indépendant.","zh-CN":"没有独立议员。",id:"Tidak ada anggota independen.",ka:"დამოუკიდებელი დეპუტატები არ არიან.",es:"No hay diputados independientes.",ja:"無所属議員はいません。",ko:"무소속 의원이 없습니다."},
"Find on chart":{
ru:"Найти на схеме",de:"Im Diagramm finden",fr:"Trouver sur le graphique","zh-CN":"在图表中查找",id:"Temukan pada bagan",ka:"დიაგრამაზე პოვნა",es:"Buscar en el gráfico",ja:"図表上で探す",ko:"차트에서 찾기"},
"Dashboard":{
ru:"Панель управления",de:"Dashboard",fr:"Tableau de bord","zh-CN":"仪表板",id:"Dasbor",ka:"მართვის პანელი",es:"Panel de control",ja:"ダッシュボード",ko:"대시보드"},
"Parliament size & seating":{
ru:"Размер парламента и рассадка",de:"Parlamentsgröße und Sitzordnung",fr:"Taille du parlement et disposition des sièges","zh-CN":"议会规模与席位安排",id:"Ukuran parlemen dan susunan kursi",ka:"პარლამენტის ზომა და განლაგება",es:"Tamaño del parlamento y distribución de escaños",ja:"議会規模・座席配置",ko:"의회 규모 및 좌석 배치"},
"Government designations":{
ru:"Статусы правительства",de:"Regierungsfunktionen",fr:"Fonctions gouvernementales","zh-CN":"政府职务",id:"Jabatan pemerintahan",ka:"მთავრობის სტატუსები",es:"Cargos gubernamentales",ja:"政府役職",ko:"정부 직책"},
"Independent deputies":{
ru:"Независимые депутаты",de:"Unabhängige Abgeordnete",fr:"Députés indépendants","zh-CN":"独立议员",id:"Anggota independen",ka:"დამოუკიდებელი დეპუტატები",es:"Diputados independientes",ja:"無所属議員",ko:"무소속 의원"},
});


Object.assign(rows, {
// Party editor, project manager, backups and deputy inspector.
"Party name":{
ru:"Название партии",de:"Parteienname",fr:"Nom du parti","zh-CN":"政党名称",id:"Nama partai",ka:"პარტიის სახელი",es:"Nombre del partido",ja:"政党名",ko:"정당 이름"},
"Party leader":{
ru:"Лидер партии",de:"Parteivorsitz",fr:"Chef du parti","zh-CN":"政党领袖",id:"Pemimpin partai",ka:"პარტიის ლიდერი",es:"Líder del partido",ja:"党首",ko:"정당 대표"},
"Government designation":{
ru:"Статус в правительстве",de:"Regierungsstatus",fr:"Statut au gouvernement","zh-CN":"政府定位",id:"Status pemerintahan",ka:"მთავრობის სტატუსი",es:"Designación gubernamental",ja:"政府での立場",ko:"정부 지위"},
"Logo / symbol":{
ru:"Логотип / символ",de:"Logo / Symbol",fr:"Logo / symbole","zh-CN":"标志/符号",id:"Logo / simbol",ka:"ლოგო / სიმბოლო",es:"Logotipo / símbolo",ja:"ロゴ／シンボル",ko:"로고 / 상징"},
"Additional metadata":{
ru:"Дополнительные сведения",de:"Zusätzliche Metadaten",fr:"Métadonnées supplémentaires","zh-CN":"附加元数据",id:"Metadata tambahan",ka:"დამატებითი მეტამონაცემები",es:"Metadatos adicionales",ja:"追加メタデータ",ko:"추가 메타데이터"},
"Give the party a name.":{
ru:"Укажите название партии.",de:"Geben Sie der Partei einen Namen.",fr:"Donnez un nom au parti.","zh-CN":"请为政党命名。",id:"Beri nama untuk partai.",ka:"მიანიჭეთ პარტიას სახელი.",es:"Asigne un nombre al partido.",ja:"政党名を入力してください。",ko:"정당 이름을 입력하세요."},
"Seat allocation":{
ru:"Распределение мест",de:"Sitzverteilung",fr:"Répartition des sièges","zh-CN":"席位分配",id:"Alokasi kursi",ka:"ადგილების განაწილება",es:"Asignación de escaños",ja:"議席配分",ko:"의석 배분"},
"Seats distributed evenly.":{
ru:"Места распределены поровну.",de:"Die Sitze wurden gleichmäßig verteilt.",fr:"Les sièges sont répartis équitablement.","zh-CN":"席位已平均分配。",id:"Kursi dibagikan secara merata.",ka:"ადგილები თანაბრად განაწილდა.",es:"Los escaños se han distribuido equitativamente.",ja:"議席は均等に配分されました。",ko:"의석이 균등하게 배분되었습니다."},
"New party":{
ru:"Новая партия",de:"Neue Partei",fr:"Nouveau parti","zh-CN":"新政党",id:"Partai baru",ka:"ახალი პარტია",es:"Nuevo partido",ja:"新しい政党",ko:"새 정당"},
"No parties yet.":{
ru:"Пока нет партий.",de:"Noch keine Parteien vorhanden.",fr:"Aucun parti pour le moment.","zh-CN":"目前还没有政党。",id:"Belum ada partai.",ka:"პარტიები ჯერ არ არის.",es:"Todavía no hay partidos.",ja:"政党はまだありません。",ko:"아직 정당이 없습니다."},
"Highlight this party in the chamber":{
ru:"Выделить эту партию в зале заседаний",de:"Diese Partei im Plenarsaal hervorheben",fr:"Mettre ce parti en évidence dans l’hémicycle","zh-CN":"在议事厅中突出显示该政党",id:"Sorot partai ini di ruang sidang",ka:"ამ პარტიის გამოკვეთა დარბაზში",es:"Resaltar este partido en la cámara",ja:"議場でこの政党を強調表示",ko:"의사당에서 이 정당 강조 표시"},
"Faction name":{
ru:"Название фракции",de:"Fraktionsname",fr:"Nom de la faction","zh-CN":"派系名称",id:"Nama faksi",ka:"ფრაქციის სახელი",es:"Nombre de la facción",ja:"派閥名",ko:"파벌 이름"},
"Faction colour":{
ru:"Цвет фракции",de:"Fraktionsfarbe",fr:"Couleur de la faction","zh-CN":"派系颜色",id:"Warna faksi",ka:"ფრაქციის ფერი",es:"Color de la facción",ja:"派閥カラー",ko:"파벌 색상"},
"Faction leader":{
ru:"Лидер фракции",de:"Fraktionsvorsitz",fr:"Chef de faction","zh-CN":"派系领袖",id:"Pemimpin faksi",ka:"ფრაქციის ლიდერი",es:"Líder de la facción",ja:"派閥リーダー",ko:"파벌 지도자"},
"New faction":{
ru:"Новая фракция",de:"Neue Fraktion",fr:"Nouvelle faction","zh-CN":"新派系",id:"Faksi baru",ka:"ახალი ფრაქცია",es:"Nueva facción",ja:"新しい派閥",ko:"새 파벌"},
"No factions yet.":{
ru:"Пока нет фракций.",de:"Noch keine Fraktionen vorhanden.",fr:"Aucune faction pour le moment.","zh-CN":"目前还没有派系。",id:"Belum ada faksi.",ka:"ფრაქციები ჯერ არ არის.",es:"Todavía no hay facciones.",ja:"派閥はまだありません。",ko:"아직 파벌이 없습니다."},
"Coalition name":{
ru:"Название коалиции",de:"Koalitionsname",fr:"Nom de la coalition","zh-CN":"联盟名称",id:"Nama koalisi",ka:"კოალიციის სახელი",es:"Nombre de la coalición",ja:"連合名",ko:"연합 이름"},
"Coalition leader":{
ru:"Лидер коалиции",de:"Koalitionsvorsitz",fr:"Chef de la coalition","zh-CN":"联盟领袖",id:"Pemimpin koalisi",ka:"კოალიციის ლიდერი",es:"Líder de la coalición",ja:"連合代表",ko:"연합 지도자"},
"New coalition":{
ru:"Новая коалиция",de:"Neue Koalition",fr:"Nouvelle coalition","zh-CN":"新联盟",id:"Koalisi baru",ka:"ახალი კოალიცია",es:"Nueva coalición",ja:"新しい連合",ko:"새 연합"},
"No coalitions yet.":{
ru:"Пока нет коалиций.",de:"Noch keine Koalitionen vorhanden.",fr:"Aucune coalition pour le moment.","zh-CN":"目前还没有联盟。",id:"Belum ada koalisi.",ka:"კოალიციები ჯერ არ არის.",es:"Todavía no hay coaliciones.",ja:"連合はまだありません。",ko:"아직 연합이 없습니다."},
"Deputy name":{
ru:"Имя депутата",de:"Name des Abgeordneten",fr:"Nom du député","zh-CN":"议员姓名",id:"Nama anggota parlemen",ka:"დეპუტატის სახელი",es:"Nombre del diputado",ja:"議員名",ko:"의원 이름"},
"Political affiliation":{
ru:"Политическая принадлежность",de:"Politische Zugehörigkeit",fr:"Affiliation politique","zh-CN":"政治归属",id:"Afiliasi politik",ka:"პოლიტიკური კუთვნილება",es:"Afiliación política",ja:"政治的所属",ko:"정치적 소속"},
"Reassigning a seat switches the deputy to manual seating.":{
ru:"Переназначение места переводит депутата на ручную рассадку.",de:"Eine Neuzuweisung des Sitzes aktiviert die manuelle Sitzordnung.",fr:"La réaffectation d’un siège active le placement manuel des députés.","zh-CN":"重新分配席位会切换为手动排座。",id:"Mengubah penempatan kursi akan mengaktifkan pengaturan kursi manual.",ka:"ადგილის ხელახლა მინიჭება დეპუტატს ხელით განლაგებაზე გადაიყვანს.",es:"Reasignar un escaño cambia la disposición a modo manual.",ja:"議席を再割り当てすると、手動座席配置に切り替わります。",ko:"좌석을 재배정하면 수동 좌석 배치로 전환됩니다."},
"— Vacant seat —":{
ru:"— Свободное место —",de:"— Freier Sitz —",fr:"— Siège vacant —","zh-CN":"— 空席 —",id:"— Kursi kosong —",ka:"— თავისუფალი ადგილი —",es:"— Escaño vacante —",ja:"— 空席 —",ko:"— 빈 좌석 —"},
"Independent":{
ru:"Независимый депутат",de:"Unabhängig",fr:"Indépendant","zh-CN":"独立议员",id:"Independen",ka:"დამოუკიდებელი",es:"Independiente",ja:"無所属",ko:"무소속"},
"No faction":{
ru:"Без фракции",de:"Keine Fraktion",fr:"Aucune faction","zh-CN":"无派系",id:"Tanpa faksi",ka:"ფრაქციის გარეშე",es:"Sin facción",ja:"派閥なし",ko:"파벌 없음"},
"Individual ideology":{
ru:"Индивидуальная идеология",de:"Individuelle Ideologie",fr:"Idéologie individuelle","zh-CN":"个人意识形态",id:"Ideologi individu",ka:"ინდივიდუალური იდეოლოგია",es:"Ideología individual",ja:"個人のイデオロギー",ko:"개인 이념"},
"Overrides faction and party ideology in ideology-based voting (default priority).":{
ru:"В голосовании по идеологии имеет приоритет над идеологиями фракции и партии (по умолчанию).",
de:"Hat bei ideologiebasierter Abstimmung Vorrang vor der Ideologie von Fraktion und Partei (Standardpriorität).",
fr:"Prévaut sur l’idéologie de la faction et du parti lors d’un vote fondé sur l’idéologie (priorité par défaut).",
"zh-CN":"在基于意识形态的投票中优先于派系和政党的意识形态（默认优先级）。",
id:"Mengungguli ideologi faksi dan partai dalam pemungutan suara berbasis ideologi (prioritas bawaan).",
ka:"იდეოლოგიაზე დაფუძნებული კენჭისყრისას უპირატესობა ენიჭება ფრაქციისა და პარტიის იდეოლოგიასთან შედარებით (ნაგულისხმევი პრიორიტეტი).",
es:"Tiene prioridad sobre la ideología de la facción y del partido en las votaciones basadas en ideología (prioridad predeterminada).",
ja:"イデオロギーに基づく投票では、派閥や政党のイデオロギーより優先されます（既定の優先順位）。",
ko:"이념 기반 투표에서 파벌 및 정당 이념보다 우선합니다(기본 우선순위)."},
"Inherit from faction / party":{
ru:"Наследовать от фракции / партии",de:"Von Fraktion / Partei übernehmen",fr:"Hériter de la faction / du parti","zh-CN":"继承派系/政党设置",id:"Ikuti faksi / partai",ka:"ფრაქციიდან / პარტიიდან მემკვიდრეობით მიღება",es:"Heredar de la facción / el partido",ja:"派閥／政党から継承",ko:"파벌 / 정당에서 상속"},
"Effective ideology:":{
ru:"Применяемая идеология:",de:"Wirksame Ideologie:",fr:"Idéologie effective :","zh-CN":"当前生效的意识形态：",id:"Ideologi yang berlaku:",ka:"მოქმედი იდეოლოგია:",es:"Ideología efectiva:",ja:"有効なイデオロギー:",ko:"적용되는 이념:"},
"Swap with seat #":{
ru:"Поменять местами с местом №",de:"Mit Sitz Nr. tauschen",fr:"Échanger avec le siège n°","zh-CN":"与席位编号互换",id:"Tukar dengan kursi nomor",ka:"გაცვლა ადგილის ნომერთან",es:"Intercambiar con el escaño n.º",ja:"座席番号と入れ替える",ko:"좌석 번호와 교환"},
"Why:":{
ru:"Причина:",de:"Begründung:",fr:"Pourquoi :","zh-CN":"原因：",id:"Alasan:",ka:"მიზეზი:",es:"Motivo:",ja:"理由:",ko:"이유:"},
"Up to three recent recovery versions are retained for each project.":{
ru:"Для каждого проекта сохраняются до трёх последних резервных версий.",
de:"Für jedes Projekt werden bis zu drei aktuelle Wiederherstellungsversionen aufbewahrt.",
fr:"Jusqu’à trois versions de récupération récentes sont conservées pour chaque projet.",
"zh-CN":"每个项目最多保留三个最近的恢复版本。",
id:"Hingga tiga versi pemulihan terbaru disimpan untuk setiap proyek.",
ka:"თითოეული პროექტისთვის ინახება აღდგენის მაქსიმუმ სამი უახლესი ვერსია.",
es:"Se conservan hasta tres versiones de recuperación recientes por proyecto.",
ja:"各プロジェクトにつき、直近3件までの復元バージョンを保持します。",
ko:"각 프로젝트마다 최근 복구 버전을 최대 3개까지 보관합니다."
},
"No recovery snapshots are available.":{
ru:"Резервные версии восстановления отсутствуют.",de:"Keine Wiederherstellungsversionen verfügbar.",fr:"Aucun instantané de récupération disponible.","zh-CN":"没有可用的恢复快照。",id:"Tidak ada snapshot pemulihan yang tersedia.",ka:"აღდგენის ასლები ხელმისაწვდომი არ არის.",es:"No hay instantáneas de recuperación disponibles.",ja:"利用可能な復元スナップショットはありません。",ko:"사용 가능한 복구 스냅샷이 없습니다."},
"Recovery snapshots":{
ru:"Резервные копии восстановления",de:"Wiederherstellungsversionen",fr:"Versions de récupération","zh-CN":"恢复快照",id:"Snapshot pemulihan",ka:"აღდგენის ასლები",es:"Instantáneas de recuperación",ja:"復元スナップショット",ko:"복구 스냅샷"},
"Backups":{
ru:"Резервные копии",de:"Sicherungen",fr:"Sauvegardes","zh-CN":"备份",id:"Cadangan",ka:"სარეზერვო ასლები",es:"Copias de seguridad",ja:"バックアップ",ko:"백업"},
"Restore":{
ru:"Восстановить",de:"Wiederherstellen",fr:"Restaurer","zh-CN":"恢复",id:"Pulihkan",ka:"აღდგენა",es:"Restaurar",ja:"復元",ko:"복원"},
"Create backup":{
ru:"Создать резервную копию",de:"Sicherung erstellen",fr:"Créer une sauvegarde","zh-CN":"创建备份",id:"Buat cadangan",ka:"სარეზერვო ასლის შექმნა",es:"Crear copia de seguridad",ja:"バックアップを作成",ko:"백업 만들기"},
"Auto-saved in this browser. Status:":{
ru:"Автоматически сохранено в этом браузере. Статус:",de:"In diesem Browser automatisch gespeichert. Status:",fr:"Enregistré automatiquement dans ce navigateur. État :","zh-CN":"已在此浏览器中自动保存。状态：",id:"Disimpan otomatis di browser ini. Status:",ka:"ავტომატურად შენახულია ამ ბრაუზერში. სტატუსი:",es:"Guardado automáticamente en este navegador. Estado:",ja:"このブラウザーに自動保存しました。状態:",ko:"이 브라우저에 자동 저장됨. 상태:"},
ru:"Причина:",de:"Begründung:",fr:"Pourquoi :","zh-CN":"原因：",id:"Alasan:",ka:"მიზეზი:",es:"Motivo:",ja:"理由:",ko:"이유:"}
});


Object.assign(rows, {
// Voting setup, voting history, issue configuration and result labels.
"Voting":{
ru:"Голосование",de:"Abstimmung",fr:"Vote","zh-CN":"投票",id:"Pemungutan suara",ka:"კენჭისყრა",es:"Votación",ja:"投票",ko:"투표"},
"Vote":{
ru:"Голос",de:"Abstimmen",fr:"Voter","zh-CN":"投票",id:"Suara",ka:"ხმის მიცემა",es:"Votar",ja:"投票する",ko:"투표"},
"Voting mode":{
ru:"Режим голосования",de:"Abstimmungsmodus",fr:"Mode de vote","zh-CN":"投票模式",id:"Mode pemungutan suara",ka:"კენჭისყრის რეჟიმი",es:"Modo de votación",ja:"投票モード",ko:"투표 방식"},
"Party voting":{
ru:"Голосование по партиям",de:"Parteienabstimmung",fr:"Vote par parti","zh-CN":"按政党投票",id:"Pemungutan suara partai",ka:"პარტიული კენჭისყრა",es:"Votación por partido",ja:"政党単位の投票",ko:"정당별 투표"},
"Ideology voting":{
ru:"Голосование по идеологиям",de:"Ideologieabstimmung",fr:"Vote par idéologie","zh-CN":"按意识形态投票",id:"Pemungutan suara ideologi",ka:"იდეოლოგიური კენჭისყრა",es:"Votación por ideología",ja:"イデオロギー別投票",ko:"이념별 투표"},
"Faction voting":{
ru:"Голосование по фракциям",de:"Fraktionsabstimmung",fr:"Vote par faction","zh-CN":"按派系投票",id:"Pemungutan suara faksi",ka:"ფრაქციული კენჭისყრა",es:"Votación por facción",ja:"派閥単位の投票",ko:"파벌별 투표"},
"Individual voting":{
ru:"Индивидуальное голосование",de:"Individuelle Abstimmung",fr:"Vote individuel","zh-CN":"个人投票",id:"Pemungutan suara individu",ka:"ინდივიდუალური კენჭისყრა",es:"Votación individual",ja:"個人投票",ko:"개별 투표"},
"Mixed voting":{
ru:"Смешанное голосование",de:"Gemischte Abstimmung",fr:"Vote mixte","zh-CN":"混合投票",id:"Pemungutan suara campuran",ka:"შერეული კენჭისყრა",es:"Votación mixta",ja:"混合投票",ko:"혼합 투표"},
"Random voting":{
ru:"Случайное голосование",de:"Zufällige Abstimmung",fr:"Vote aléatoire","zh-CN":"随机投票",id:"Pemungutan suara acak",ka:"შემთხვევითი კენჭისყრა",es:"Votación aleatoria",ja:"ランダム投票",ko:"무작위 투표"},
"Run vote":{
ru:"Провести голосование",de:"Abstimmung durchführen",fr:"Lancer le vote","zh-CN":"进行投票",id:"Jalankan pemungutan suara",ka:"კენჭისყრის ჩატარება",es:"Realizar votación",ja:"投票を実行",ko:"투표 실행"},
"Run simulation":{
ru:"Запустить симуляцию",de:"Simulation starten",fr:"Lancer la simulation","zh-CN":"运行模拟",id:"Jalankan simulasi",ka:"სიმულაციის გაშვება",es:"Iniciar simulación",ja:"シミュレーションを実行",ko:"시뮬레이션 실행"},
"Issue name":{
ru:"Название вопроса",de:"Vorlagenname",fr:"Nom du texte","zh-CN":"议案名称",id:"Nama isu",ka:"საკითხის სახელი",es:"Nombre del asunto",ja:"議案名",ko:"안건 이름"},
"Bill":{
ru:"Законопроект",de:"Gesetzentwurf",fr:"Projet de loi","zh-CN":"法案",id:"RUU",ka:"კანონპროექტი",es:"Proyecto de ley",ja:"法案",ko:"법안"},
"Resolution":{
ru:"Резолюция",de:"Resolution",fr:"Résolution","zh-CN":"决议",id:"Resolusi",ka:"რეზოლუცია",es:"Resolución",ja:"決議",ko:"결의안"},
"Motion":{
ru:"Предложение",de:"Antrag",fr:"Motion","zh-CN":"动议",id:"Mosi",ka:"წინადადება",es:"Moción",ja:"動議",ko:"동의안"},
"Amendment":{
ru:"Поправка",de:"Änderungsantrag",fr:"Amendement","zh-CN":"修正案",id:"Amandemen",ka:"შესწორება",es:"Enmienda",ja:"修正案",ko:"수정안"},
"Confidence vote":{
ru:"Голосование о доверии",de:"Vertrauensabstimmung",fr:"Vote de confiance","zh-CN":"信任投票",id:"Pemungutan suara kepercayaan",ka:"ნდობის კენჭისყრა",es:"Voto de confianza",ja:"信任投票",ko:"신임 투표"},
"Other":{
ru:"Другое",de:"Sonstiges",fr:"Autre","zh-CN":"其他",id:"Lainnya",ka:"სხვა",es:"Otro",ja:"その他",ko:"기타"},
"Background":{
ru:"Предыстория",de:"Hintergrund",fr:"Contexte","zh-CN":"背景",id:"Latar belakang",ka:"ფონი",es:"Antecedentes",ja:"背景",ko:"배경"},
"Notes":{
ru:"Примечания",de:"Notizen",fr:"Notes","zh-CN":"备注",id:"Catatan",ka:"შენიშვნები",es:"Notas",ja:"メモ",ko:"메모"},
"Category":{
ru:"Категория",de:"Kategorie",fr:"Catégorie","zh-CN":"类别",id:"Kategori",ka:"კატეგორია",es:"Categoría",ja:"カテゴリー",ko:"범주"},
"Threshold":{
ru:"Порог",de:"Schwellenwert",fr:"Seuil","zh-CN":"门槛",id:"Ambang batas",ka:"ზღვარი",es:"Umbral",ja:"しきい値",ko:"기준"},
"Quorum":{
ru:"Кворум",de:"Quorum",fr:"Quorum","zh-CN":"法定人数",id:"Kuorum",ka:"კვორუმი",es:"Quórum",ja:"定足数",ko:"정족수"},
"Simple majority":{
ru:"Простое большинство",de:"Einfache Mehrheit",fr:"Majorité simple","zh-CN":"简单多数",id:"Mayoritas sederhana",ka:"უბრალო უმრავლესობა",es:"Mayoría simple",ja:"単純過半数",ko:"단순 과반수"},
"Absolute majority":{
ru:"Абсолютное большинство",de:"Absolute Mehrheit",fr:"Majorité absolue","zh-CN":"绝对多数",id:"Mayoritas absolut",ka:"აბსოლუტური უმრავლესობა",es:"Mayoría absoluta",ja:"絶対多数",ko:"절대 과반수"},
"Qualified majority":{
ru:"Квалифицированное большинство",de:"Qualifizierte Mehrheit",fr:"Majorité qualifiée","zh-CN":"特别多数",id:"Mayoritas khusus",ka:"კვალიფიციური უმრავლესობა",es:"Mayoría cualificada",ja:"特別多数",ko:"특별 다수"},
"Two-thirds majority":{
ru:"Большинство в две трети",de:"Zwei-Drittel-Mehrheit",fr:"Majorité des deux tiers","zh-CN":"三分之二多数",id:"Mayoritas dua pertiga",ka:"ორი მესამედის უმრავლესობა",es:"Mayoría de dos tercios",ja:"3分の2の多数",ko:"3분의 2 다수"},
"Three-fifths majority":{
ru:"Большинство в три пятых",de:"Drei-Fünftel-Mehrheit",fr:"Majorité des trois cinquièmes","zh-CN":"五分之三多数",id:"Mayoritas tiga perlima",ka:"სამი მეხუთედის უმრავლესობა",es:"Mayoría de tres quintos",ja:"5分の3の多数",ko:"5분의 3 다수"},
"Custom threshold":{
ru:"Пользовательский порог",de:"Benutzerdefinierter Schwellenwert",fr:"Seuil personnalisé","zh-CN":"自定义门槛",id:"Ambang batas khusus",ka:"მორგებული ზღვარი",es:"Umbral personalizado",ja:"カスタムしきい値",ko:"사용자 지정 기준"},
"For % present":{
ru:"За, % присутствующих",de:"Dafür, % der Anwesenden",fr:"Pour, % des présents","zh-CN":"赞成，占出席者比例",id:"Setuju, % hadir",ka:"მომხრე, დამსწრეთა %",es:"A favor, % de presentes",ja:"賛成（出席者比）",ko:"찬성, 출석자 비율"},
"Votes held":{
ru:"Проведённые голосования",de:"Durchgeführte Abstimmungen",fr:"Votes tenus","zh-CN":"已举行的投票",id:"Pemungutan suara yang dilakukan",ka:"ჩატარებული კენჭისყრები",es:"Votaciones realizadas",ja:"実施された投票",ko:"실시된 투표"},
"Custom ideologies":{
ru:"Пользовательские идеологии",de:"Benutzerdefinierte Ideologien",fr:"Idéologies personnalisées","zh-CN":"自定义意识形态",id:"Ideologi khusus",ka:"მორგებული იდეოლოგიები",es:"Ideologías personalizadas",ja:"カスタムイデオロギー",ko:"사용자 정의 이념"},
"Specific ideology overrides":{
ru:"Индивидуальные правила для идеологий",de:"Spezifische Ideologie-Überschreibungen",fr:"Remplacements par idéologie spécifique","zh-CN":"特定意识形态覆盖规则",id:"Aturan khusus ideologi",ka:"სპეციფიკური იდეოლოგიის გადაფარვები",es:"Reglas específicas por ideología",ja:"個別イデオロギーの上書き",ko:"특정 이념 재정의"},
"Overrides the group position for one ideology (also custom ideologies), including custom probabilities.":{
ru:"Переопределяет позицию группы для одной идеологии (в том числе пользовательской), включая пользовательские вероятности.",
de:"Überschreibt die Gruppenposition für eine Ideologie (auch benutzerdefinierte) einschließlich eigener Wahrscheinlichkeiten.",
fr:"Remplace la position du groupe pour une idéologie (y compris personnalisée), avec des probabilités personnalisées.",
"zh-CN":"为单个意识形态（包括自定义意识形态）覆盖群体立场，并可设置自定义概率。",
id:"Menggantikan posisi kelompok untuk satu ideologi (termasuk ideologi khusus), beserta probabilitas khusus.",
ka:"ცვლის ჯგუფის პოზიციას ერთი იდეოლოგიისთვის (მორგებულის ჩათვლით), მათ შორის მორგებული ალბათობებით.",
es:"Sobrescribe la posición del grupo para una ideología (incluidas las personalizadas), con probabilidades propias.",
ja:"カスタム確率を含め、1つのイデオロギー（カスタムを含む）のグループ位置を上書きします。",
ko:"사용자 지정 확률을 포함하여 하나의 이념(사용자 정의 이념 포함)에 대한 그룹 입장을 재정의합니다."
},
"Add ideology override…":{
ru:"Добавить переопределение идеологии…",de:"Ideologie-Überschreibung hinzufügen …",fr:"Ajouter une exception d’idéologie…","zh-CN":"添加意识形态覆盖规则…",id:"Tambahkan aturan khusus ideologi…",ka:"იდეოლოგიის გადაფარვის დამატება…",es:"Añadir excepción de ideología…",ja:"イデオロギーの上書きを追加…",ko:"이념 재정의 추가…"},
"— not set —":{
ru:"— не задано —",de:"— nicht festgelegt —",fr:"— non défini —","zh-CN":"— 未设置 —",id:"— belum diatur —",ka:"— მითითებული არ არის —",es:"— sin establecer —",ja:"— 未設定 —",ko:"— 설정 안 됨 —"},
"— unset —":{
ru:"— не установлено —",de:"— nicht gesetzt —",fr:"— non défini —","zh-CN":"— 未设定 —",id:"— belum ditetapkan —",ka:"— დაყენებული არ არის —",es:"— sin asignar —",ja:"— 未設定 —",ko:"— 지정 안 됨 —"},
"No parties to configure.":{
ru:"Нет партий для настройки.",de:"Keine Parteien zum Konfigurieren.",fr:"Aucun parti à configurer.","zh-CN":"没有可配置的政党。",id:"Tidak ada partai untuk dikonfigurasi.",ka:"კონფიგურაციისთვის პარტიები არ არის.",es:"No hay partidos que configurar.",ja:"設定できる政党はありません。",ko:"구성할 정당이 없습니다."},
"No factions: deputies follow the party line.":{
ru:"Фракций нет: депутаты следуют линии партии.",de:"Keine Fraktionen: Abgeordnete folgen der Parteilinie.",fr:"Aucune faction : les députés suivent la ligne du parti.","zh-CN":"没有派系：议员遵循政党立场。",id:"Tidak ada faksi: anggota parlemen mengikuti garis partai.",ka:"ფრაქციები არ არის: დეპუტატები პარტიის ხაზს მიჰყვებიან.",es:"No hay facciones: los diputados siguen la línea del partido.",ja:"派閥がない場合、議員は政党の方針に従います。",ko:"파벌이 없으면 의원은 정당 노선을 따릅니다."},
"All weights are zero — they will be treated as equal.":{
ru:"Все веса равны нулю — они будут считаться равными.",de:"Alle Gewichtungen sind null – sie werden als gleich behandelt.",fr:"Tous les poids sont nuls — ils seront considérés comme égaux.","zh-CN":"所有权重均为零——将按相等处理。",id:"Semua bobot bernilai nol — akan dianggap sama.",ka:"ყველა წონა ნულის ტოლია — ისინი თანაბრად ჩაითვლება.",es:"Todos los pesos son cero: se tratarán como iguales.",ja:"すべての重みがゼロのため、同じ重みとして扱われます。",ko:"모든 가중치가 0이므로 동일한 값으로 처리됩니다."},
"Party decision":{
ru:"Решение партии",de:"Parteientscheidung",fr:"Décision du parti","zh-CN":"政党决定",id:"Keputusan partai",ka:"პარტიის გადაწყვეტილება",es:"Decisión del partido",ja:"政党の決定",ko:"정당 결정"},
"Choose how each party's deputies decide. Independents follow their own behaviour; individual overrides (below) always win.":{
ru:"Выберите, как голосуют депутаты каждой партии. Независимые депутаты следуют собственным настройкам поведения; индивидуальные переопределения (ниже) всегда имеют приоритет.",
de:"Legen Sie fest, wie die Abgeordneten jeder Partei entscheiden. Unabhängige folgen ihrem eigenen Verhalten; individuelle Überschreibungen (unten) haben immer Vorrang.",
fr:"Choisissez comment votent les députés de chaque parti. Les indépendants suivent leur propre comportement ; les remplacements individuels (ci-dessous) sont toujours prioritaires.",
"zh-CN":"选择每个政党的议员如何作出决定。独立议员遵循自身行为设置；个人覆盖规则（下方）始终优先。",
id:"Pilih bagaimana anggota parlemen setiap partai mengambil keputusan. Anggota independen mengikuti perilakunya sendiri; aturan individu (di bawah) selalu diutamakan.",
ka:"აირჩიეთ, როგორ იღებენ გადაწყვეტილებას თითოეული პარტიის დეპუტატები. დამოუკიდებელი დეპუტატები საკუთარ ქცევის პარამეტრებს მიჰყვებიან; ინდივიდუალური გადაფარვები (ქვემოთ) ყოველთვის პრიორიტეტულია.",
es:"Elija cómo deciden los diputados de cada partido. Los independientes siguen su propio comportamiento; las excepciones individuales (abajo) siempre prevalecen.",
ja:"各政党の議員がどのように判断するかを選択します。無所属議員は独自の行動設定に従い、個別の上書き設定（下記）が常に優先されます。",
ko:"각 정당 의원의 결정 방식을 선택합니다. 무소속 의원은 자체 행동 설정을 따르며, 개별 재정의(아래)가 항상 우선합니다."
},
"No deputies match.":{
ru:"Нет подходящих депутатов.",de:"Keine passenden Abgeordneten.",fr:"Aucun député correspondant.","zh-CN":"没有匹配的议员。",id:"Tidak ada anggota parlemen yang cocok.",ka:"შესაბამისი დეპუტატები ვერ მოიძებნა.",es:"No hay diputados coincidentes.",ja:"一致する議員はいません。",ko:"일치하는 의원이 없습니다."},
});

export default rows;


const translateAllLocales = (
  ru: string, de: string, fr: string, zh: string, id: string, ka: string, es: string, ja: string, ko: string
): Record<string, string> => ({ ru, de, fr, "zh-CN": zh, id, ka, es, ja, ko });

Object.assign(rows, {
// Navigation, chamber legend, project, party, faction and deputy screens.
"Coalitions": translateAllLocales("Коалиции","Koalitionen","Coalitions","联盟","Koalisi","კოალიციები","Coaliciones","連合","연합"),
"Factions": translateAllLocales("Фракции","Fraktionen","Factions","派系","Faksi","ფრაქციები","Facciones","派閥","파벌"),
"Ideologies": translateAllLocales("Идеологии","Ideologien","Idéologies","意识形态","Ideologi","იდეოლოგიები","Ideologías","イデオロギー","이념"),
"Statistics": translateAllLocales("Статистика","Statistiken","Statistiques","统计","Statistik","სტატისტიკა","Estadísticas","統計","통계"),
"Settings": translateAllLocales("Настройки","Einstellungen","Paramètres","设置","Pengaturan","პარამეტრები","Configuración","設定","설정"),
"Loading parliament…": translateAllLocales("Загрузка парламента…","Parlament wird geladen…","Chargement du parlement…","正在加载议会…","Memuat parlemen…","პარლამენტი იტვირთება…","Cargando el parlamento…","議会を読み込み中…","의회 불러오는 중…"),
"Parliament overview": translateAllLocales("Обзор парламента","Parlamentsübersicht","Vue d’ensemble du parlement","议会概览","Ikhtisar parlemen","პარლამენტის მიმოხილვა","Resumen del parlamento","議会の概要","의회 개요"),
"Political parties": translateAllLocales("Политические партии","Politische Parteien","Partis politiques","政党","Partai politik","პოლიტიკური პარტიები","Partidos políticos","政党","정당"),
"Internal factions": translateAllLocales("Внутренние фракции","Interne Fraktionen","Factions internes","内部派系","Faksi internal","შიდა ფრაქციები","Facciones internas","内部派閥","내부 파벌"),
"Collapse panel": translateAllLocales("Свернуть панель","Panel einklappen","Réduire le panneau","折叠面板","Ciutkan panel","პანელის ჩაკეცვა","Contraer el panel","パネルを折りたたむ","패널 접기"),
"Expand panel": translateAllLocales("Развернуть панель","Panel ausklappen","Développer le panneau","展开面板","Perluas panel","პანელის გაშლა","Expandir el panel","パネルを展開する","패널 펼치기"),
"Sections": translateAllLocales("Разделы","Bereiche","Sections","分区","Bagian","სექციები","Secciones","セクション","섹션"),
"Layer": translateAllLocales("Слой","Ebene","Calque","图层","Lapisan","ფენა","Capa","レイヤー","레이어"),
"Standard": translateAllLocales("Стандартный","Standard","Standard","标准","Standar","სტანდარტული","Estándar","標準","표준"),
"Coalition colours": translateAllLocales("Цвета коалиций","Koalitionsfarben","Couleurs des coalitions","联盟颜色","Warna koalisi","კოალიციის ფერები","Colores de las coaliciones","連合の色","연합 색상"),
"Detailed": translateAllLocales("Подробно","Detailliert","Détaillé","详细","Terperinci","დეტალურად","Detallado","詳細","상세"),
"Parliament seating chart": translateAllLocales("Схема рассадки парламента","Sitzplan des Parlaments","Plan des sièges du parlement","议会席位图","Bagan susunan kursi parlemen","პარლამენტის ადგილების სქემა","Plano de escaños del parlamento","議会の座席図","의회 좌석 배치도"),
"Votes:": translateAllLocales("Голоса:","Stimmen:","Voix :","票数：","Suara:","ხმები:","Votos:","票数:","표:"),
"Click to focus": translateAllLocales("Нажмите, чтобы выделить","Klicken, um hervorzuheben","Cliquez pour mettre en évidence","点击以聚焦","Klik untuk menyorot","დააწკაპუნეთ გამოსაკვეთად","Haga clic para resaltar","クリックして強調表示","클릭하여 강조 표시"),
"Fill = coalition colour (small dot = party) · parties outside coalitions keep their own colour.": translateAllLocales("Заливка = цвет коалиции (маленькая точка = партия) · партии вне коалиций сохраняют собственный цвет.","Füllung = Koalitionsfarbe (kleiner Punkt = Partei) · Parteien außerhalb von Koalitionen behalten ihre eigene Farbe.","Remplissage = couleur de la coalition (petit point = parti) · les partis hors coalition gardent leur propre couleur.","填充色 = 联盟颜色（小圆点 = 政党）；不属于联盟的政党保留自身颜色。","Isian = warna koalisi (titik kecil = partai) · partai di luar koalisi mempertahankan warnanya sendiri.","შევსება = კოალიციის ფერი (პატარა წერტილი = პარტია) · კოალიციის გარეთ მყოფი პარტიები საკუთარ ფერს ინარჩუნებენ.","Relleno = color de la coalición (punto pequeño = partido) · los partidos fuera de coaliciones conservan su propio color.","塗りつぶし＝連合カラー（小さな点＝政党）・連合に属さない政党は独自の色を維持します。","채우기 = 연합 색상(작은 점 = 정당) · 연합에 속하지 않은 정당은 자체 색상을 유지합니다。"),
"Fill = faction · inner ring = party · outer ring = coalition.": translateAllLocales("Заливка = фракция · внутреннее кольцо = партия · внешнее кольцо = коалиция.","Füllung = Fraktion · innerer Ring = Partei · äußerer Ring = Koalition.","Remplissage = faction · anneau intérieur = parti · anneau extérieur = coalition.","填充色 = 派系 · 内环 = 政党 · 外环 = 联盟。","Isian = faksi · cincin dalam = partai · cincin luar = koalisi.","შევსება = ფრაქცია · შიდა რგოლი = პარტია · გარე რგოლი = კოალიცია.","Relleno = facción · anillo interior = partido · anillo exterior = coalición.","塗りつぶし＝派閥・内側のリング＝政党・外側のリング＝連合。","채우기 = 파벌 · 안쪽 링 = 정당 · 바깥쪽 링 = 연합。"),
"Coalition created — add member parties below.": translateAllLocales("Коалиция создана — добавьте партии-участницы ниже.","Koalition erstellt – fügen Sie unten die Mitgliedsparteien hinzu.","Coalition créée — ajoutez les partis membres ci-dessous.","联盟已创建——请在下方添加成员政党。","Koalisi dibuat — tambahkan partai anggota di bawah.","კოალიცია შეიქმნა — ქვემოთ დაამატეთ წევრი პარტიები.","Coalición creada: añada los partidos miembros a continuación.","連合を作成しました。下に構成政党を追加してください。","연합이 생성되었습니다. 아래에서 회원 정당을 추가하세요."),
"Member parties": translateAllLocales("Партии-участницы","Mitgliedsparteien","Partis membres","成员政党","Partai anggota","წევრი პარტიები","Partidos miembros","構成政党","회원 정당"),
"Coalition leader (optional)": translateAllLocales("Лидер коалиции (необязательно)","Koalitionsvorsitz (optional)","Chef de coalition (facultatif)","联盟领袖（可选）","Pemimpin koalisi (opsional)","კოალიციის ლიდერი (არასავალდებულო)","Líder de la coalición (opcional)","連合代表（任意）","연합 대표(선택 사항)"),
"Create a party first — factions live inside parties.": translateAllLocales("Сначала создайте партию — фракции существуют внутри партий.","Erstellen Sie zuerst eine Partei – Fraktionen gehören zu Parteien.","Créez d’abord un parti : les factions font partie des partis.","请先创建政党——派系隶属于政党。","Buat partai terlebih dahulu — faksi berada di dalam partai.","ჯერ შექმენით პარტია — ფრაქციები პარტიების შიგნით იქმნება.","Primero cree un partido: las facciones forman parte de los partidos.","先に政党を作成してください。派閥は政党の内部に属します。","먼저 정당을 만드세요. 파벌은 정당 내부에 속합니다."),
"Parent party": translateAllLocales("Родительская партия","Übergeordnete Partei","Parti parent","所属政党","Partai induk","ძირითადი პარტია","Partido matriz","所属政党","상위 정당"),
"Deputies": translateAllLocales("Депутаты","Abgeordnete","Députés","议员","Anggota parlemen","დეპუტატები","Diputados","議員","의원"),
"Give the faction a name.": translateAllLocales("Укажите название фракции.","Geben Sie der Fraktion einen Namen.","Donnez un nom à la faction.","请为派系命名。","Beri nama untuk faksi.","მიანიჭეთ ფრაქციას სახელი.","Asigne un nombre a la facción.","派閥名を入力してください。","파벌 이름을 입력하세요."),
"Faction created.": translateAllLocales("Фракция создана.","Fraktion erstellt.","Faction créée.","派系已创建。","Faksi berhasil dibuat.","ფრაქცია შეიქმნა.","Facción creada.","派閥を作成しました。","파벌이 생성되었습니다."),
"no leader": translateAllLocales("нет лидера","keine Führung","sans dirigeant","无领袖","tanpa pemimpin","ლიდერის გარეშე","sin líder","リーダーなし","지도자 없음"),
"Parliament Sandbox": translateAllLocales("Parliament Sandbox","Parliament Sandbox","Parliament Sandbox","Parliament Sandbox","Parliament Sandbox","Parliament Sandbox","Parliament Sandbox","Parliament Sandbox","Parliament Sandbox"),
"Parliament Sandbox Simulator": translateAllLocales("Симулятор парламента","Parlamentssimulator","Simulateur parlementaire","议会模拟器","Simulator Parlemen","პარლამენტის სიმულატორი","Simulador parlamentario","議会シミュレーター","의회 시뮬레이터"),
"Build Parties, Factions & Voting Systems": translateAllLocales("Создавайте партии, фракции и системы голосования","Parteien, Fraktionen und Abstimmungssysteme gestalten","Créez des partis, des factions et des systèmes de vote","创建政党、派系与投票制度","Bangun partai, faksi, dan sistem pemungutan suara","შექმენით პარტიები, ფრაქციები და კენჭისყრის სისტემები","Cree partidos, facciones y sistemas de votación","政党・派閥・投票制度を構築","정당·파벌·투표 시스템 만들기"),
"Close": translateAllLocales("Закрыть","Schließen","Fermer","关闭","Tutup","დახურვა","Cerrar","閉じる","닫기"),
"Total seats": translateAllLocales("Всего мест","Sitze insgesamt","Total des sièges","席位总数","Jumlah kursi","ადგილების საერთო რაოდენობა","Escaños totales","総議席数","전체 의석 수"),
"Allocated": translateAllLocales("Распределено","Zugewiesen","Attribués","已分配","Dialokasikan","განაწილებული","Asignados","配分済み","배정됨"),
"Unallocated": translateAllLocales("Не распределено","Nicht zugewiesen","Non attribués","未分配","Belum dialokasikan","გაუნაწილებელი","Sin asignar","未配分","미배정"),
"Independents": translateAllLocales("Независимые депутаты","Unabhängige","Indépendants","独立议员","Independen","დამოუკიდებლები","Independientes","無所属議員","무소속 의원"),
"Majority line": translateAllLocales("Линия большинства","Mehrheitslinie","Seuil de majorité","多数线","Garis mayoritas","უმრავლესობის ხაზი","Línea de mayoría","過半数ライン","과반선"),
"more than half of seats": translateAllLocales("более половины мест","mehr als die Hälfte der Sitze","plus de la moitié des sièges","超过半数席位","lebih dari setengah kursi","ადგილების ნახევარზე მეტი","más de la mitad de los escaños","議席の過半数超","의석 과반 초과"),
"Majority status": translateAllLocales("Статус большинства","Mehrheitsstatus","Statut de la majorité","多数状态","Status mayoritas","უმრავლესობის სტატუსი","Situación de la mayoría","多数派の状況","과반 상태"),
"Government": translateAllLocales("Правительство","Regierung","Gouvernement","政府","Pemerintah","მთავრობა","Gobierno","政府","정부"),
"Support": translateAllLocales("Поддержка","Unterstützung","Soutien","支持","Dukungan","მხარდაჭერა","Apoyo","支持","지지"),
"Neutral": translateAllLocales("Нейтральные","Neutral","Neutres","中立","Netral","ნეიტრალური","Neutrales","中立","중립"),
"Opposition": translateAllLocales("Оппозиция","Opposition","Opposition","反对派","Oposisi","ოპოზიცია","Oposición","野党","야당"),
"Composition": translateAllLocales("Состав","Zusammensetzung","Composition","构成","Komposisi","შემადგენლობა","Composición","構成","구성"),
"If shrinking below allocated seats": translateAllLocales("При уменьшении числа мест ниже уже распределенного количества","Wenn die Sitzzahl unter die bereits zugewiesenen Sitze sinkt","Si le nombre de sièges devient inférieur au nombre déjà attribué","当席位总数低于已分配席位时","Jika jumlah kursi dikurangi hingga di bawah kursi yang telah dialokasikan","თუ ადგილების რაოდენობა უკვე განაწილებულ ადგილებზე ნაკლები გახდება","Si se reduce el número de escaños por debajo de los ya asignados","議席数が配分済みの議席数を下回る場合","의석 수가 이미 배정된 의석보다 적어질 경우"),
"Parliament projects": translateAllLocales("Проекты парламента","Parlamentsprojekte","Projets parlementaires","议会项目","Proyek parlemen","პარლამენტის პროექტები","Proyectos parlamentarios","議会プロジェクト","의회 프로젝트"),
"No saved projects.": translateAllLocales("Нет сохранённых проектов.","Keine gespeicherten Projekte.","Aucun projet enregistré.","没有已保存的项目。","Tidak ada proyek tersimpan.","შენახული პროექტები არ არის.","No hay proyectos guardados.","保存されたプロジェクトはありません。","저장된 프로젝트가 없습니다."),
"New parliament": translateAllLocales("Новый парламент","Neues Parlament","Nouveau parlement","新建议会","Parlemen baru","ახალი პარლამენტი","Nuevo parlamento","新しい議会","새 의회"),
"Seats (blank project)": translateAllLocales("Количество мест (пустой проект)","Sitze (leeres Projekt)","Sièges (projet vierge)","席位数（空白项目）","Jumlah kursi (proyek kosong)","ადგილები (ცარიელი პროექტი)","Escaños (proyecto vacío)","議席数（空のプロジェクト）","의석 수(빈 프로젝트)"),
"Current project": translateAllLocales("Текущий проект","Aktuelles Projekt","Projet actuel","当前项目","Proyek saat ini","მიმდინარე პროექტი","Proyecto actual","現在のプロジェクト","현재 프로젝트"),
"Import": translateAllLocales("Импортировать","Importieren","Importer","导入","Impor","იმპორტი","Importar","インポート","가져오기"),
"Faction": translateAllLocales("Фракция","Fraktion","Faction","派系","Faksi","ფრაქცია","Facción","派閥","파벌"),
"Voting behaviour": translateAllLocales("Поведение при голосовании","Abstimmungsverhalten","Comportement électoral","投票行为","Perilaku pemungutan suara","კენჭისყრის ქცევა","Comportamiento de voto","投票行動","투표 행동"),
"Affiliation / notes": translateAllLocales("Принадлежность / примечания","Zugehörigkeit / Hinweise","Affiliation / notes","党派归属/备注","Afiliasi / catatan","კუთვნილება / შენიშვნები","Afiliación / notas","所属／メモ","소속 / 메모"),
"e.g. Local list, ex-PDU": translateAllLocales("например, местный список, бывшая ПДЕ","z. B. lokale Liste, ehemals PDU","ex. : liste locale, ancien PDU","例如：地方名单、前人民民主联盟成员","mis. daftar lokal, mantan PDU","მაგ., ადგილობრივი სია, ყოფილი პდკ","p. ej., lista local, exmiembro del PDU","例：地域名簿、元PDU所属","예: 지역 명단, 전 PDU"),

});


Object.assign(rows, {
// Settings and visualisation controls.
"Colours & visualisation": translateAllLocales("Цвета и визуализация","Farben und Visualisierung","Couleurs et visualisation","颜色与可视化","Warna dan visualisasi","ფერები და ვიზუალიზაცია","Colores y visualización","色と表示","색상 및 시각화"),
"Unallocated seat colour": translateAllLocales("Цвет нераспределённых мест","Farbe nicht zugewiesener Sitze","Couleur des sièges non attribués","未分配席位颜色","Warna kursi yang belum dialokasikan","გაუნაწილებელი ადგილების ფერი","Color de los escaños no asignados","未配分議席の色","미배정 의석 색상"),
"Show coalition rings": translateAllLocales("Показывать кольца коалиций","Koalitionsringe anzeigen","Afficher les anneaux des coalitions","显示联盟环","Tampilkan cincin koalisi","კოალიციის რგოლების ჩვენება","Mostrar anillos de coalición","連合リングを表示","연합 링 표시"),
"Ring thickness": translateAllLocales("Толщина кольца","Ringstärke","Épaisseur de l’anneau","环的粗细","Ketebalan cincin","რგოლის სისქე","Grosor del anillo","リングの太さ","링 두께"),
"Show seat numbers": translateAllLocales("Показывать номера мест","Sitznummern anzeigen","Afficher les numéros des sièges","显示席位编号","Tampilkan nomor kursi","ადგილების ნომრების ჩვენება","Mostrar números de escaño","座席番号を表示","좌석 번호 표시"),
"Best with large seats / small parliaments.": translateAllLocales("Лучше всего подходит для крупных мест и небольших парламентов.","Am besten für große Sitze und kleine Parlamente geeignet.","Idéal avec de grands sièges ou de petits parlements.","适合较大的席位或规模较小的议会。","Paling sesuai untuk kursi besar atau parlemen kecil.","საუკეთესოა დიდი ადგილებისა და მცირე პარლამენტებისთვის.","Funciona mejor con escaños grandes o parlamentos pequeños.","大きな座席や小規模な議会に適しています。","큰 좌석 또는 소규모 의회에 적합합니다."),
"Dim seats outside the focused group": translateAllLocales("Затемнять места вне выбранной группы","Sitze außerhalb der ausgewählten Gruppe abdunkeln","Assombrir les sièges hors du groupe sélectionné","调暗所选群体以外的席位","Redupkan kursi di luar kelompok yang difokuskan","არჩეული ჯგუფის გარეთ ადგილების ჩაბნელება","Atenuar los escaños fuera del grupo seleccionado","選択したグループ以外の座席を暗くする","선택한 그룹 외 좌석 어둡게 표시"),
"Legend contents": translateAllLocales("Содержимое легенды","Legendeninhalt","Contenu de la légende","图例内容","Isi legenda","ლეგენდის შიგთავსი","Contenido de la leyenda","凡例の内容","범례 내용"),
"Animation": translateAllLocales("Анимация","Animation","Animation","动画","Animasi","ანიმაცია","Animación","アニメーション","애니메이션"),
"Animate vote reveal": translateAllLocales("Анимировать показ результатов голосования","Abstimmungsergebnisse animiert anzeigen","Animer l’affichage des résultats du vote","以动画显示投票结果","Animasikan penampilan hasil pemungutan suara","კენჭისყრის შედეგების ანიმაციით ჩვენება","Animar la aparición del resultado de la votación","投票結果の表示をアニメーション化","투표 결과 애니메이션 표시"),
"Reduced-motion system settings are always respected.": translateAllLocales("Системные настройки уменьшения движения всегда соблюдаются.","Systemeinstellungen für reduzierte Bewegung werden immer beachtet.","Les paramètres système de réduction des animations sont toujours respectés.","始终遵循系统的减少动态效果设置。","Pengaturan sistem untuk mengurangi gerakan selalu dihormati.","შემცირებული მოძრაობის სისტემური პარამეტრები ყოველთვის დაცულია.","Siempre se respetan los ajustes del sistema para reducir el movimiento.","視差効果を減らすシステム設定は常に尊重されます。","동작 줄이기 시스템 설정은 항상 준수됩니다."),
"Animate seat/colour changes": translateAllLocales("Анимировать изменения мест и цветов","Sitz- und Farbänderungen animieren","Animer les changements de sièges et de couleurs","为席位/颜色变化添加动画","Animasikan perubahan kursi/warna","ადგილებისა და ფერების ცვლილებების ანიმაცია","Animar cambios de escaños y colores","座席や色の変更をアニメーション化","좌석/색상 변경 애니메이션"),
"Animation speed": translateAllLocales("Скорость анимации","Animationsgeschwindigkeit","Vitesse de l’animation","动画速度","Kecepatan animasi","ანიმაციის სიჩქარე","Velocidad de la animación","アニメーション速度","애니메이션 속도"),
"Voting defaults (new issues)": translateAllLocales("Настройки голосования по умолчанию (новые вопросы)","Abstimmungsstandardwerte (neue Vorlagen)","Paramètres de vote par défaut (nouveaux textes)","投票默认设置（新议题）","Pengaturan bawaan pemungutan suara (isu baru)","კენჭისყრის ნაგულისხმევი პარამეტრები (ახალი საკითხები)","Valores predeterminados de votación (nuevos asuntos)","投票の既定値（新しい議題）","투표 기본값(새 안건)"),
"Default voting mode": translateAllLocales("Режим голосования по умолчанию","Standard-Abstimmungsmodus","Mode de vote par défaut","默认投票模式","Mode pemungutan suara bawaan","კენჭისყრის ნაგულისხმევი რეჟიმი","Modo de votación predeterminado","既定の投票方式","기본 투표 방식"),
"Random probabilities (weights)": translateAllLocales("Случайные вероятности (веса)","Zufallswahrscheinlichkeiten (Gewichtungen)","Probabilités aléatoires (pondérations)","随机概率（权重）","Probabilitas acak (bobot)","შემთხვევითი ალბათობები (წონები)","Probabilidades aleatorias (ponderaciones)","ランダム確率（重み）","무작위 확률(가중치)"),
"Majority thresholds are set per issue (and can be saved as default from the issue editor).": translateAllLocales("Порог большинства задаётся для каждого вопроса отдельно (его можно сохранить по умолчанию в редакторе вопроса).","Mehrheitsschwellen werden für jede Vorlage einzeln festgelegt (und können im Vorlageneditor als Standard gespeichert werden).","Les seuils de majorité sont définis pour chaque texte (et peuvent être enregistrés par défaut depuis son éditeur).","多数门槛按议题分别设置（也可在议题编辑器中保存为默认值）。","Ambang mayoritas diatur untuk setiap isu (dan dapat disimpan sebagai bawaan dari editor isu).","უმრავლესობის ზღვარი თითოეული საკითხისთვის ცალკე განისაზღვრება (და მისი ნაგულისხმევ მნიშვნელობად შენახვა საკითხის რედაქტორიდან შეიძლება).","Los umbrales de mayoría se establecen para cada asunto (y pueden guardarse como predeterminados desde su editor).","多数要件は議題ごとに設定します（議題エディターから既定値として保存することもできます）。","과반 기준은 안건별로 설정하며 안건 편집기에서 기본값으로 저장할 수도 있습니다."),
"Show sources & references": translateAllLocales("Показывать источники и литературу","Quellen und Literatur anzeigen","Afficher les sources et références","显示来源与参考资料","Tampilkan sumber dan referensi","წყაროებისა და ლიტერატურის ჩვენება","Mostrar fuentes y referencias","出典・参考文献を表示","출처 및 참고문헌 표시"),
"Show classification notes (disputed placements)": translateAllLocales("Показывать примечания о классификации (спорные позиции)","Klassifikationshinweise anzeigen (umstrittene Einordnungen)","Afficher les notes de classification (classements contestés)","显示分类说明（存在争议的归类）","Tampilkan catatan klasifikasi (penempatan yang diperdebatkan)","კლასიფიკაციის შენიშვნების ჩვენება (სადავო განთავსებები)","Mostrar notas de clasificación (ubicaciones debatidas)","分類注記を表示（議論のある位置付け）","분류 참고 사항 표시(논쟁적인 배치)"),
"Interface": translateAllLocales("Интерфейс","Oberfläche","Interface","界面","Antarmuka","ინტერფეისი","Interfaz","インターフェース","인터페이스"),
"Theme": translateAllLocales("Тема","Design","Thème","主题","Tema","თემა","Tema","テーマ","테마"),
"☀ Light": translateAllLocales("☀ Светлая","☀ Hell","☀ Clair","☀ 浅色","☀ Terang","☀ ნათელი","☀ Claro","☀ ライト","☀ 라이트"),
"☾ Dark": translateAllLocales("☾ Тёмная","☾ Dunkel","☾ Sombre","☾ 深色","☾ Gelap","☾ მუქი","☾ Oscuro","☾ ダーク","☾ 다크"),
"Settings are saved automatically with the project.": translateAllLocales("Настройки автоматически сохраняются вместе с проектом.","Die Einstellungen werden automatisch mit dem Projekt gespeichert.","Les paramètres sont automatiquement enregistrés avec le projet.","设置会随项目自动保存。","Pengaturan disimpan otomatis bersama proyek.","პარამეტრები პროექტთან ერთად ავტომატურად ინახება.","La configuración se guarda automáticamente con el proyecto.","設定はプロジェクトとともに自動保存されます。","설정은 프로젝트와 함께 자동 저장됩니다。"),
// Statistics labels and empty states.
"Parliament dashboard": translateAllLocales("Панель парламента","Parlaments-Dashboard","Tableau de bord du parlement","议会仪表板","Dasbor parlemen","პარლამენტის მართვის პანელი","Panel del parlamento","議会ダッシュボード","의회 대시보드"),
"Party strength": translateAllLocales("Расстановка сил партий","Parteienstärke","Poids des partis","政党实力","Kekuatan partai","პარტიების ძალთა ბალანსი","Fuerza de los partidos","政党勢力","정당 세력"),
"Party": translateAllLocales("Партия","Partei","Parti","政党","Partai","პარტია","Partido","政党","정당"),
"Share": translateAllLocales("Доля","Anteil","Part","占比","Proporsi","წილი","Porcentaje","割合","비율"),
"Role": translateAllLocales("Роль","Rolle","Rôle","角色","Peran","როლი","Cargo","役割","역할"),
"No coalitions.": translateAllLocales("Коалиций нет.","Keine Koalitionen.","Aucune coalition.","没有联盟。","Tidak ada koalisi.","კოალიციები არ არის.","No hay coaliciones.","連合はありません。","연합이 없습니다."),
"Vote history overview": translateAllLocales("Обзор истории голосований","Überblick über den Abstimmungsverlauf","Aperçu de l’historique des votes","投票历史概览","Ikhtisar riwayat pemungutan suara","კენჭისყრების ისტორიის მიმოხილვა","Resumen del historial de votaciones","投票履歴の概要","투표 기록 개요"),
"No votes yet.": translateAllLocales("Голосований пока нет.","Noch keine Abstimmungen.","Aucun vote pour le moment.","尚无投票记录。","Belum ada pemungutan suara.","კენჭისყრები ჯერ არ არის.","Aún no hay votaciones.","まだ投票はありません。","아직 투표가 없습니다."),
"Issue": translateAllLocales("Вопрос","Vorlage","Texte","议题","Isu","საკითხი","Asunto","議題","안건"),
"Mode": translateAllLocales("Режим","Modus","Mode","模式","Mode","რეჟიმი","Modo","方式","방식"),
"For": translateAllLocales("За","Dafür","Pour","赞成","Setuju","მომხრე","A favor","賛成","찬성"),
"Against": translateAllLocales("Против","Dagegen","Contre","反对","Menolak","წინააღმდეგი","En contra","反対","반대"),
"Abstain": translateAllLocales("Воздержался","Enthaltung","Abstention","弃权","Abstain","თავი შეიკავა","Abstención","棄権","기권"),
"Absent": translateAllLocales("Отсутствовал","Abwesend","Absent","缺席","Tidak hadir","არ ესწრებოდა","Ausente","欠席","불참"),
"Result": translateAllLocales("Результат","Ergebnis","Résultat","结果","Hasil","შედეგი","Resultado","結果","결과"),
"Passed": translateAllLocales("Принято","Angenommen","Adopté","通过","Disahkan","მიღებულია","Aprobado","可決","가결"),
"Failed": translateAllLocales("Отклонено","Abgelehnt","Rejeté","未通过","Ditolak","უარყოფილია","Rechazado","否決","부결"),
// Voting modes, thresholds, issue editor and run-vote action.
"▶ Run vote": translateAllLocales("▶ Провести голосование","▶ Abstimmung durchführen","▶ Lancer le vote","▶ 进行投票","▶ Jalankan pemungutan suara","▶ კენჭისყრის ჩატარება","▶ Realizar votación","▶ 投票を実行","▶ 투표 실행"),
"A · Party-based": translateAllLocales("A · По партийной линии","A · Parteienbasiert","A · Par parti","A · 按政党","A · Berbasis partai","A · პარტიული","A · Por partido","A · 政党別","A · 정당 기반"),
"Every deputy follows the party's decision (subject to party discipline).": translateAllLocales("Каждый депутат следует решению партии с учётом партийной дисциплины.","Jeder Abgeordnete folgt der Entscheidung seiner Partei, vorbehaltlich der Parteidisziplin.","Chaque député suit la décision de son parti, sous réserve de la discipline du parti.","每位议员遵循政党决定（受党纪约束）。","Setiap anggota parlemen mengikuti keputusan partainya (dengan tunduk pada disiplin partai).","თითოეული დეპუტატი მიჰყვება პარტიის გადაწყვეტილებას (პარტიული დისციპლინის გათვალისწინებით).","Cada diputado sigue la decisión de su partido, sujeta a la disciplina partidista.","各議員は党議に従います（党規律の適用を受けます）。","각 의원은 당 규율에 따라 정당의 결정을 따릅니다."),
"B · Ideology-based": translateAllLocales("B · По идеологии","B · Ideologiebasiert","B · Par idéologie","B · 按意识形态","B · Berbasis ideologi","B · იდეოლოგიური","B · Por ideología","B · イデオロギー別","B · 이념 기반"),
"Deputies vote according to their ideology (individual → faction → party by default) and the position configured for this issue.": translateAllLocales("Депутаты голосуют в соответствии со своей идеологией (по умолчанию: личная → фракционная → партийная) и позицией, заданной для этого вопроса.","Abgeordnete stimmen gemäß ihrer Ideologie und der für diese Vorlage festgelegten Position ab (Standardpriorität: individuell → Fraktion → Partei).","Les députés votent selon leur idéologie et la position définie pour ce texte (priorité par défaut : individuelle → faction → parti).","议员根据自身意识形态以及该议题设定的立场投票（默认优先级：个人 → 派系 → 政党）。","Anggota parlemen memilih sesuai ideologinya dan posisi yang ditetapkan untuk isu ini (prioritas bawaan: individu → faksi → partai).","დეპუტატები ხმას აძლევენ საკუთარი იდეოლოგიისა და ამ საკითხისთვის განსაზღვრული პოზიციის შესაბამისად (ნაგულისხმევი პრიორიტეტი: ინდივიდუალური → ფრაქცია → პარტია).","Los diputados votan según su ideología y la posición configurada para este asunto (prioridad predeterminada: individual → facción → partido).","議員は自身のイデオロギーとこの議題に設定された立場に従って投票します（既定の優先順位：個人 → 派閥 → 政党）。","의원은 자신의 이념과 해당 안건에 설정된 입장에 따라 투표합니다(기본 우선순위: 개인 → 파벌 → 정당)."),
"C · Faction-based": translateAllLocales("C · По фракциям","C · Fraktionsbasiert","C · Par faction","C · 按派系","C · Berbasis faksi","C · ფრაქციული","C · Por facción","C · 派閥別","C · 파벌 기반"),
"Each faction has its own decision; deputies without a faction follow their party.": translateAllLocales("У каждой фракции своё решение; депутаты без фракции следуют линии партии.","Jede Fraktion trifft eine eigene Entscheidung; Abgeordnete ohne Fraktion folgen ihrer Partei.","Chaque faction a sa propre décision ; les députés sans faction suivent leur parti.","每个派系独立决定；没有派系的议员遵循所属政党。","Setiap faksi memiliki keputusan sendiri; anggota tanpa faksi mengikuti partainya.","თითოეულ ფრაქციას საკუთარი გადაწყვეტილება აქვს; ფრაქციის გარეშე მყოფი დეპუტატები პარტიას მიჰყვებიან.","Cada facción tiene su propia decisión; los diputados sin facción siguen a su partido.","各派閥が独自に決定し、派閥に属さない議員は政党の方針に従います。","각 파벌은 자체 결정을 내리며, 파벌이 없는 의원은 소속 정당을 따릅니다."),
"D · Individual": translateAllLocales("D · Индивидуально","D · Individuell","D · Individuel","D · 个人","D · Individu","D · ინდივიდუალური","D · Individual","D · 個人別","D · 개별"),
"You decide how each single deputy votes.": translateAllLocales("Вы самостоятельно определяете голос каждого депутата.","Sie bestimmen, wie jeder einzelne Abgeordnete abstimmt.","Vous décidez du vote de chaque député individuellement.","由你决定每位议员如何投票。","Anda menentukan suara setiap anggota parlemen secara individual.","თქვენ განსაზღვრავთ თითოეული დეპუტატის ხმას.","Usted decide cómo vota cada diputado.","各議員の投票先を個別に決定します。","각 의원의 투표를 개별적으로 결정합니다."),
"E · Fully random": translateAllLocales("E · Полностью случайно","E · Vollständig zufällig","E · Entièrement aléatoire","E · 完全随机","E · Sepenuhnya acak","E · სრულად შემთხვევითი","E · Totalmente aleatorio","E · 完全ランダム","E · 완전 무작위"),
"Each deputy votes independently using the probabilities you set.": translateAllLocales("Каждый депутат голосует независимо, используя заданные вами вероятности.","Jeder Abgeordnete stimmt unabhängig anhand der von Ihnen festgelegten Wahrscheinlichkeiten ab.","Chaque député vote indépendamment selon les probabilités que vous définissez.","每位议员根据你设定的概率独立投票。","Setiap anggota parlemen memilih secara independen menggunakan probabilitas yang Anda tetapkan.","თითოეული დეპუტატი დამოუკიდებლად აძლევს ხმას თქვენ მიერ განსაზღვრული ალბათობების მიხედვით.","Cada diputado vota de forma independiente según las probabilidades que usted establezca.","各議員は設定された確率に基づいて独立して投票します。","각 의원은 설정한 확률에 따라 독립적으로 투표합니다."),
"F · Mixed": translateAllLocales("F · Смешанный режим","F · Gemischt","F · Mixte","F · 混合","F · Campuran","F · შერეული","F · Mixto","F · 混合","F · 혼합"),
"Choose a method per party; independents and individual overrides are handled too.": translateAllLocales("Выберите метод для каждой партии; независимые депутаты и индивидуальные переопределения также учитываются.","Wählen Sie eine Methode pro Partei; Unabhängige und individuelle Überschreibungen werden ebenfalls berücksichtigt.","Choisissez une méthode par parti ; les indépendants et les règles individuelles sont également pris en compte.","为每个政党选择一种方法；独立议员和个人覆盖规则也会被处理。","Pilih metode untuk setiap partai; anggota independen dan aturan individual juga diperhitungkan.","აირჩიეთ მეთოდი თითოეული პარტიისთვის; დამოუკიდებელი დეპუტატები და ინდივიდუალური გადაფარვებიც გათვალისწინებულია.","Elija un método por partido; también se tienen en cuenta los independientes y las excepciones individuales.","政党ごとに方式を選択します。無所属議員と個別の上書き設定も処理されます。","정당별 방식을 선택합니다. 무소속 의원과 개별 재정의도 반영됩니다."),
"All parliamentary seats": translateAllLocales("Все места парламента","Alle Parlamentssitze","Tous les sièges du parlement","议会全部席位","Semua kursi parlemen","პარლამენტის ყველა ადგილი","Todos los escaños parlamentarios","議会の全議席","의회 전체 의석"),
"Deputies present": translateAllLocales("Присутствующие депутаты","Anwesende Abgeordnete","Députés présents","出席议员","Anggota yang hadir","დამსწრე დეპუტატები","Diputados presentes","出席議員","출석 의원"),
"Valid votes (For + Against)": translateAllLocales("Действительные голоса (за + против)","Gültige Stimmen (Dafür + Dagegen)","Suffrages valides (pour + contre)","有效票（赞成 + 反对）","Suara sah (Setuju + Menolak)","ნამდვილი ხმები (მომხრე + წინააღმდეგი)","Votos válidos (a favor + en contra)","有効票（賛成＋反対）","유효 투표(찬성 + 반대)"),
"Majority type": translateAllLocales("Тип большинства","Mehrheitstyp","Type de majorité","多数类型","Jenis mayoritas","უმრავლესობის ტიპი","Tipo de mayoría","多数の種類","과반 유형"),
"Simple majority (more For than Against)": translateAllLocales("Простое большинство (за больше, чем против)","Einfache Mehrheit (mehr Dafür- als Dagegen-Stimmen)","Majorité simple (plus de voix pour que contre)","简单多数（赞成票多于反对票）","Mayoritas sederhana (suara setuju lebih banyak daripada menolak)","უბრალო უმრავლესობა (მომხრე ხმები მეტია, ვიდრე მოწინააღმდეგე)","Mayoría simple (más votos a favor que en contra)","単純過半数（賛成が反対を上回る）","단순 과반수(찬성이 반대보다 많음)"),
"Absolute majority (> 50% of all seats)": translateAllLocales("Абсолютное большинство (> 50% всех мест)","Absolute Mehrheit (> 50 % aller Sitze)","Majorité absolue (> 50 % de tous les sièges)","绝对多数（超过全部席位的50%）","Mayoritas absolut (> 50% dari seluruh kursi)","აბსოლუტური უმრავლესობა (ყველა ადგილის >50%)","Mayoría absoluta (> 50 % de todos los escaños)","絶対多数（全議席の50％超）","절대 과반수(전체 의석의 50% 초과)"),
"Qualified majority (custom %)": translateAllLocales("Квалифицированное большинство (заданный %)","Qualifizierte Mehrheit (benutzerdefinierter %)","Majorité qualifiée (% personnalisé)","特别多数（自定义百分比）","Mayoritas khusus (% khusus)","კვალიფიციური უმრავლესობა (მორგებული %)","Mayoría cualificada (% personalizado)","特別多数（任意の割合）","특별 다수(사용자 지정 %)"),
"Custom constitutional rules": translateAllLocales("Пользовательские конституционные правила","Benutzerdefinierte Verfassungsregeln","Règles constitutionnelles personnalisées","自定义宪法规则","Aturan konstitusional khusus","მორგებული კონსტიტუციური წესები","Reglas constitucionales personalizadas","独自の憲法ルール","사용자 지정 헌법 규칙"),
"Required percentage": translateAllLocales("Требуемый процент","Erforderlicher Prozentsatz","Pourcentage requis","所需百分比","Persentase yang diperlukan","საჭირო პროცენტი","Porcentaje requerido","必要な割合","필요 비율"),
"Calculated from": translateAllLocales("Рассчитывается от","Berechnet anhand von","Calculé à partir de","计算依据","Dihitung dari","გამოითვლება საფუძველზე","Calculado a partir de","計算基準","계산 기준"),
"Party discipline": translateAllLocales("Партийная дисциплина","Parteidisziplin","Discipline du parti","党纪","Disiplin partai","პარტიული დისციპლინა","Disciplina del partido","党規律","당 규율"),
"Faction discipline": translateAllLocales("Дисциплина фракции","Fraktionsdisziplin","Discipline de faction","派系纪律","Disiplin faksi","ფრაქციული დისციპლინა","Disciplina de la facción","派閥規律","파벌 규율"),
"Ideological adherence": translateAllLocales("Следование идеологии","Ideologische Bindung","Adhésion idéologique","意识形态遵循度","Kepatuhan ideologis","იდეოლოგიისადმი ერთგულება","Adhesión ideológica","イデオロギーへの準拠","이념 준수도"),
"Randomness": translateAllLocales("Случайность","Zufälligkeit","Aléatoire","随机性","Keacakan","შემთხვევითობა","Aleatoriedad","ランダム性","무작위성"),
"Abstention probability": translateAllLocales("Вероятность воздержания","Enthaltungswahrscheinlichkeit","Probabilité d’abstention","弃权概率","Probabilitas abstain","თავშეკავების ალბათობა","Probabilidad de abstención","棄権確率","기권 확률"),
"Absence probability": translateAllLocales("Вероятность отсутствия","Abwesenheitswahrscheinlichkeit","Probabilité d’absence","缺席概率","Probabilitas tidak hadir","არყოფნის ალბათობა","Probabilidad de ausencia","欠席確率","불참 확률"),
"Issue details": translateAllLocales("Сведения о вопросе","Vorlagendetails","Détails du texte","议题详情","Detail isu","საკითხის დეტალები","Detalles del asunto","議題の詳細","안건 세부 정보"),
"AI Regulations Act": translateAllLocales("Закон о регулировании ИИ","KI-Regulierungsgesetz","Loi sur la réglementation de l’IA","人工智能监管法案","Undang-Undang Regulasi AI","ხელოვნური ინტელექტის რეგულირების აქტი","Ley de regulación de la IA","AI規制法","AI 규제법"),
"Background / context (optional)": translateAllLocales("Предыстория / контекст (необязательно)","Hintergrund / Kontext (optional)","Contexte (facultatif)","背景/语境（可选）","Latar belakang / konteks (opsional)","წინაპირობა / კონტექსტი (არასავალდებულო)","Antecedentes / contexto (opcional)","背景／文脈（任意）","배경 / 맥락(선택 사항)"),
"Category (optional)": translateAllLocales("Категория (необязательно)","Kategorie (optional)","Catégorie (facultative)","类别（可选）","Kategori (opsional)","კატეგორია (არასავალდებულო)","Categoría (opcional)","カテゴリー（任意）","범주(선택 사항)"),
"Technology": translateAllLocales("Технологии","Technologie","Technologie","技术","Teknologi","ტექნოლოგია","Tecnología","テクノロジー","기술"),
"Voting type": translateAllLocales("Тип голосования","Abstimmungsart","Type de vote","投票类型","Jenis pemungutan suara","კენჭისყრის ტიპი","Tipo de votación","投票種別","투표 유형"),
"Additional notes": translateAllLocales("Дополнительные примечания","Zusätzliche Hinweise","Notes supplémentaires","附加说明","Catatan tambahan","დამატებითი შენიშვნები","Notas adicionales","追加メモ","추가 메모"),
"Party decisions": translateAllLocales("Решения партий","Parteientscheidungen","Décisions des partis","政党决定","Keputusan partai","პარტიების გადაწყვეტილებები","Decisiones de los partidos","政党の決定","정당 결정"),
"Faction decisions": translateAllLocales("Решения фракций","Fraktionsentscheidungen","Décisions des factions","派系决定","Keputusan faksi","ფრაქციების გადაწყვეტილებები","Decisiones de las facciones","派閥の決定","파벌 결정"),
"Ideological positions": translateAllLocales("Идеологические позиции","Ideologische Positionen","Positions idéologiques","意识形态立场","Posisi ideologis","იდეოლოგიური პოზიციები","Posiciones ideológicas","イデオロギー上の立場","이념적 입장"),
"Individual decisions": translateAllLocales("Индивидуальные решения","Individuelle Entscheidungen","Décisions individuelles","个人决定","Keputusan individu","ინდივიდუალური გადაწყვეტილებები","Decisiones individuales","個別の決定","개별 결정"),
"Random probabilities": translateAllLocales("Случайные вероятности","Zufallswahrscheinlichkeiten","Probabilités aléatoires","随机概率","Probabilitas acak","შემთხვევითი ალბათობები","Probabilidades aleatorias","ランダム確率","무작위 확률"),
"No votes yet. Run a vote to build the history.": translateAllLocales("Голосований пока нет. Проведите голосование, чтобы начать вести историю.","Noch keine Abstimmungen. Führen Sie eine Abstimmung durch, um den Verlauf aufzubauen.","Aucun vote pour le moment. Lancez un vote pour commencer l’historique.","尚无投票记录。进行一次投票即可建立历史记录。","Belum ada pemungutan suara. Jalankan pemungutan suara untuk mulai membuat riwayat.","კენჭისყრები ჯერ არ არის. ისტორიის შესაქმნელად ჩაატარეთ კენჭისყრა.","Aún no hay votaciones. Realice una votación para crear el historial.","まだ投票はありません。投票を実行すると履歴が作成されます。","아직 투표가 없습니다. 투표를 실행하면 기록이 생성됩니다."),
"Comparison": translateAllLocales("Сравнение","Vergleich","Comparaison","比较","Perbandingan","შედარება","Comparación","比較","비교"),
"Outcome": translateAllLocales("Итог","Ergebnis","Résultat","结果","Hasil akhir","შედეგი","Resultado","結果","결과"),
"Issues": translateAllLocales("Вопросы","Vorlagen","Textes","议题","Isu","საკითხები","Asuntos","議題","안건"),
"Configure": translateAllLocales("Настроить","Konfigurieren","Configurer","配置","Konfigurasikan","კონფიგურაცია","Configurar","設定","구성"),
"Create a parliamentary question, bill or resolution to vote on.": translateAllLocales("Создайте парламентский вопрос, законопроект или резолюцию для голосования.","Erstellen Sie eine parlamentarische Anfrage, einen Gesetzentwurf oder eine Resolution zur Abstimmung.","Créez une question parlementaire, un projet de loi ou une résolution à soumettre au vote.","创建一个可供投票的议会质询、法案或决议。","Buat pertanyaan parlemen, rancangan undang-undang, atau resolusi untuk dipungut suaranya.","შექმენით საპარლამენტო შეკითხვა, კანონპროექტი ან რეზოლუცია კენჭისყრისთვის.","Cree una pregunta parlamentaria, un proyecto de ley o una resolución para someterla a votación.","採決にかける議会質問、法案、または決議を作成してください。","표결할 의회 질의, 법안 또는 결의안을 만드세요."),
"Select or create an issue first.": translateAllLocales("Сначала выберите или создайте вопрос.","Wählen Sie zuerst eine Vorlage aus oder erstellen Sie eine neue.","Sélectionnez ou créez d’abord un texte.","请先选择或创建一个议题。","Pilih atau buat isu terlebih dahulu.","ჯერ აირჩიეთ ან შექმენით საკითხი.","Primero seleccione o cree un asunto.","先に議題を選択または作成してください。","먼저 안건을 선택하거나 만드세요."),
"Run a vote from the panel on the left to see the animated chamber, statistics and breakdowns here.": translateAllLocales("Запустите голосование на панели слева, чтобы увидеть здесь анимированный зал заседаний, статистику и подробные результаты.","Starten Sie links im Bedienfeld eine Abstimmung, um hier den animierten Plenarsaal, Statistiken und Aufschlüsselungen zu sehen.","Lancez un vote dans le panneau de gauche pour voir ici l’hémicycle animé, les statistiques et les résultats détaillés.","在左侧面板中进行投票，即可在此查看议事厅动画、统计数据和详细分布。","Jalankan pemungutan suara dari panel di sebelah kiri untuk melihat animasi ruang sidang, statistik, dan rinciannya di sini.","მარცხენა პანელიდან ჩაატარეთ კენჭისყრა, რათა აქ იხილოთ დარბაზის ანიმაცია, სტატისტიკა და დეტალური შედეგები.","Realice una votación desde el panel de la izquierda para ver aquí la cámara animada, las estadísticas y los desgloses.","左側のパネルから投票を実行すると、ここに議場のアニメーション、統計、内訳が表示されます。","왼쪽 패널에서 투표를 실행하면 여기에서 의사당 애니메이션, 통계 및 세부 내역을 볼 수 있습니다."),
"Why did each deputy vote this way?": translateAllLocales("Почему каждый депутат проголосовал именно так?","Warum hat jeder Abgeordnete so abgestimmt?","Pourquoi chaque député a-t-il voté ainsi ?","每位议员为何这样投票？","Mengapa setiap anggota parlemen memilih seperti ini?","რატომ მისცა თითოეულმა დეპუტატმა ხმა ასე?","¿Por qué votó así cada diputado?","各議員がこのように投票した理由","각 의원은 왜 이렇게 투표했나요?"),
"Search deputy…": translateAllLocales("Найти депутата…","Abgeordneten suchen …","Rechercher un député…","搜索议员…","Cari anggota parlemen…","დეპუტატის ძიება…","Buscar diputado…","議員を検索…","의원 검색…"),
"Deputy": translateAllLocales("Депутат","Abgeordneter","Député","议员","Anggota parlemen","დეპუტატი","Diputado","議員","의원"),
"Reasoning": translateAllLocales("Обоснование","Begründung","Justification","理由","Alasan","დასაბუთება","Justificación","理由","근거"),
// Ideology browser/editor and common controls.
"Edit": translateAllLocales("Изменить","Bearbeiten","Modifier","编辑","Edit","რედაქტირება","Editar","編集","편집"),
"Delete": translateAllLocales("Удалить","Löschen","Supprimer","删除","Hapus","წაშლა","Eliminar","削除","삭제"),
"No description.": translateAllLocales("Описание отсутствует.","Keine Beschreibung.","Aucune description.","暂无描述。","Tidak ada deskripsi.","აღწერა არ არის.","Sin descripción.","説明はありません。","설명이 없습니다."),
"Select an ideology to see details.": translateAllLocales("Выберите идеологию, чтобы посмотреть подробности.","Wählen Sie eine Ideologie aus, um Details anzuzeigen.","Sélectionnez une idéologie pour afficher les détails.","选择一种意识形态以查看详情。","Pilih ideologi untuk melihat detail.","დეტალების სანახავად აირჩიეთ იდეოლოგია.","Seleccione una ideología para ver los detalles.","詳細を表示するにはイデオロギーを選択してください。","세부 정보를 보려면 이념을 선택하세요."),
"No ideology": translateAllLocales("Без идеологии","Keine Ideologie","Aucune idéologie","无意识形态","Tanpa ideologi","იდეოლოგიის გარეშე","Sin ideología","イデオロギーなし","이념 없음"),
"Clear ideology": translateAllLocales("Сбросить идеологию","Ideologie entfernen","Effacer l’idéologie","清除意识形态","Hapus ideologi","იდეოლოგიის გასუფთავება","Borrar ideología","イデオロギーを解除","이념 지우기"),
"Choose an ideology": translateAllLocales("Выберите идеологию","Ideologie auswählen","Choisir une idéologie","选择一种意识形态","Pilih ideologi","აირჩიეთ იდეოლოგია","Elegir una ideología","イデオロギーを選択","이념 선택"),
"Search by name, alias or keyword…": translateAllLocales("Поиск по названию, альтернативному названию или ключевому слову…","Nach Name, Alias oder Stichwort suchen …","Rechercher par nom, alias ou mot-clé…","按名称、别名或关键词搜索…","Cari berdasarkan nama, alias, atau kata kunci…","ძიება სახელით, ალტერნატიული სახელით ან საკვანძო სიტყვით…","Buscar por nombre, alias o palabra clave…","名称・別名・キーワードで検索…","이름, 별칭 또는 키워드로 검색…"),
"No ideologies match your search.": translateAllLocales("По вашему запросу идеологии не найдены.","Keine Ideologien entsprechen Ihrer Suche.","Aucune idéologie ne correspond à votre recherche.","没有符合搜索条件的意识形态。","Tidak ada ideologi yang cocok dengan pencarian Anda.","თქვენი ძიების შესაბამისი იდეოლოგია ვერ მოიძებნა.","No hay ideologías que coincidan con su búsqueda.","検索条件に一致するイデオロギーはありません。","검색 결과와 일치하는 이념이 없습니다."),
"Reset to default": translateAllLocales("Сбросить настройки","Auf Standard zurücksetzen","Rétablir les valeurs par défaut","重置为默认值","Atur ulang ke bawaan","ნაგულისხმევ მნიშვნელობაზე დაბრუნება","Restablecer los valores predeterminados","既定値に戻す","기본값으로 재설정"),
"Dismiss": translateAllLocales("Скрыть","Schließen","Ignorer","关闭","Tutup","დახურვა","Descartar","閉じる","닫기")
});


Object.assign(rows, {
// Ten ideological-family names and the classification/axis interface.
"Liberal & Libertarian Traditions": translateAllLocales("Либеральные и либертарианские традиции","Liberale und libertäre Traditionen","Traditions libérales et libertaires","自由主义与自由意志主义传统","Tradisi liberal dan libertarian","ლიბერალური და ლიბერტარიანული ტრადიციები","Tradiciones liberales y libertarias","自由主義・リバタリアンの伝統","자유주의 및 자유지상주의 전통"),
"Conservative & Traditionalist Traditions": translateAllLocales("Консервативные и традиционалистские традиции","Konservative und traditionalistische Traditionen","Traditions conservatrices et traditionalistes","保守主义与传统主义传统","Tradisi konservatif dan tradisionalis","კონსერვატიული და ტრადიციონალისტური ტრადიციები","Tradiciones conservadoras y tradicionalistas","保守主義・伝統主義の伝統","보수주의 및 전통주의 전통"),
"Social-Democratic & Reformist Traditions": translateAllLocales("Социал-демократические и реформистские традиции","Sozialdemokratische und reformistische Traditionen","Traditions sociales-démocrates et réformistes","社会民主主义与改革主义传统","Tradisi sosial-demokratis dan reformis","სოციალ-დემოკრატიული და რეფორმისტული ტრადიციები","Tradiciones socialdemócratas y reformistas","社会民主主義・改革主義の伝統","사회민주주의 및 개혁주의 전통"),
"Democratic & Pluralist Socialist Traditions": translateAllLocales("Демократические и плюралистические социалистические традиции","Demokratische und pluralistische sozialistische Traditionen","Traditions socialistes démocratiques et pluralistes","民主与多元社会主义传统","Tradisi sosialis demokratis dan pluralis","დემოკრატიული და პლურალისტური სოციალისტური ტრადიციები","Tradiciones socialistas democráticas y pluralistas","民主的・多元主義的社会主義の伝統","민주적 및 다원주의적 사회주의 전통"),
"Authoritarian & State-Communist Traditions": translateAllLocales("Авторитарные и государственно-коммунистические традиции","Autoritäre und staatskommunistische Traditionen","Traditions autoritaires et communistes d’État","威权主义与国家共产主义传统","Tradisi otoriter dan komunis negara","ავტორიტარული და სახელმწიფო-კომუნისტური ტრადიციები","Tradiciones autoritarias y comunistas de Estado","権威主義・国家共産主義の伝統","권위주의 및 국가공산주의 전통"),
"Anarchist & Anti-Authoritarian Traditions": translateAllLocales("Анархистские и антиавторитарные традиции","Anarchistische und antiautoritäre Traditionen","Traditions anarchistes et anti-autoritaires","无政府主义与反威权主义传统","Tradisi anarkis dan antiotoriter","ანარქისტული და ანტიავტორიტარული ტრადიციები","Tradiciones anarquistas y antiautoritarias","アナキズム・反権威主義の伝統","아나키즘 및 반권위주의 전통"),
"Nationalist & Sovereigntist Traditions": translateAllLocales("Националистические и суверенистские традиции","Nationalistische und souveränistische Traditionen","Traditions nationalistes et souverainistes","民族主义与主权主义传统","Tradisi nasionalis dan souverainis","ნაციონალისტური და სუვერენისტული ტრადიციები","Tradiciones nacionalistas y soberanistas","ナショナリズム・主権主義の伝統","민족주의 및 주권주의 전통"),
"Fascist & Ultranationalist Traditions": translateAllLocales("Фашистские и ультранационалистические традиции","Faschistische und ultranationalistische Traditionen","Traditions fascistes et ultranationalistes","法西斯主义与极端民族主义传统","Tradisi fasis dan ultranasionalis","ფაშისტური და ულტრანაციონალისტური ტრადიციები","Tradiciones fascistas y ultranacionalistas","ファシズム・超国家主義の伝統","파시즘 및 초국가주의 전통"),
"Religious & Communitarian Traditions": translateAllLocales("Религиозные и коммунитарные традиции","Religiöse und kommunitaristische Traditionen","Traditions religieuses et communautaristes","宗教与社群主义传统","Tradisi religius dan komunitarian","რელიგიური და კომუნიტარიანული ტრადიციები","Tradiciones religiosas y comunitaristas","宗教・共同体主義の伝統","종교 및 공동체주의 전통"),
"Civic, Ecological & Cross-Cutting Traditions": translateAllLocales("Гражданские, экологические и сквозные традиции","Zivilgesellschaftliche, ökologische und querschnittliche Traditionen","Traditions civiques, écologiques et transversales","公民、生态与跨领域传统","Tradisi kewargaan, ekologis, dan lintas bidang","სამოქალაქო, ეკოლოგიური და სხვადასხვა მიმართულების ტრადიციები","Tradiciones cívicas, ecológicas y transversales","市民・環境・横断的な伝統","시민·생태 및 초분야 전통"),
"Unclassified": translateAllLocales("Не классифицировано","Nicht klassifiziert","Non classé","未分类","Belum diklasifikasikan","არაკლასიფიცირებული","Sin clasificar","未分類","미분류"),
"Custom ideology awaiting family and dimensional classification.": translateAllLocales("Пользовательская идеология ожидает отнесения к семейству и классификации по измерениям.","Benutzerdefinierte Ideologie wartet auf die Zuordnung zu einer Familie und die Einordnung nach Dimensionen.","L’idéologie personnalisée attend son classement dans une famille et selon les dimensions.","自定义意识形态尚待分配所属家族并完成多维分类。","Ideologi khusus menunggu penetapan keluarga dan klasifikasi dimensinya.","მორგებული იდეოლოგია ელოდება იდეოლოგიურ ოჯახსა და განზომილებებში კლასიფიცირებას.","La ideología personalizada espera la asignación a una familia y su clasificación dimensional.","カスタムイデオロギーは、系統と各次元の分類待ちです。","사용자 정의 이념은 계열 및 차원별 분류를 기다리고 있습니다."),
"Economic orientation": translateAllLocales("Экономическая ориентация","Wirtschaftliche Ausrichtung","Orientation économique","经济取向","Orientasi ekonomi","ეკონომიკური ორიენტაცია","Orientación económica","経済的志向","경제적 성향"),
"Social orientation": translateAllLocales("Социальная ориентация","Gesellschaftliche Ausrichtung","Orientation sociale","社会取向","Orientasi sosial","სოციალური ორიენტაცია","Orientación social","社会的志向","사회적 성향"),
"Political authority": translateAllLocales("Политическая власть","Politische Autorität","Autorité politique","政治权力","Otoritas politik","პოლიტიკური ძალაუფლება","Autoridad política","政治的権威","정치적 권위"),
"Not specified": translateAllLocales("Не указано","Nicht angegeben","Non précisé","未指定","Tidak ditentukan","მითითებული არ არის","No especificado","未指定","지정되지 않음"),
"Far Left": translateAllLocales("Крайне левые","Linksaußen","Extrême gauche","极左翼","Kiri ekstrem","ულტრამემარცხენეობა","Extrema izquierda","極左","극좌"),
"Left": translateAllLocales("Левые","Links","Gauche","左翼","Kiri","მემარცხენეობა","Izquierda","左派","좌파"),
"Center-Left": translateAllLocales("Левоцентристы","Mitte-links","Centre gauche","中左翼","Kiri-tengah","მემარცხენე-ცენტრი","Centroizquierda","中道左派","중도좌파"),
"Center": translateAllLocales("Центр","Mitte","Centre","中间","Tengah","ცენტრი","Centro","中道","중도"),
"Center-Right": translateAllLocales("Правоцентристы","Mitte-rechts","Centre droit","中右翼","Kanan-tengah","მემარჯვენე-ცენტრი","Centro derecha","中道右派","중도우파"),
"Right": translateAllLocales("Правые","Rechts","Droite","右翼","Kanan","მემარჯვენეობა","Derecha","右派","우파"),
"Far Right": translateAllLocales("Крайне правые","Rechtsaußen","Extrême droite","极右翼","Kanan ekstrem","ულტრამემარჯვენეობა","Extrema derecha","極右","극우"),
"Far Progressive": translateAllLocales("Крайне прогрессивные","Stark progressiv","Très progressiste","极端进步主义","Sangat progresif","უკიდურესად პროგრესული","Muy progresista","極めて進歩的","극진보"),
"Progressive": translateAllLocales("Прогрессивные","Progressiv","Progressiste","进步主义","Progresif","პროგრესული","Progresista","進歩的","진보"),
"Center-Progressive": translateAllLocales("Центр-прогрессивные","Mitte-progressiv","Centre progressiste","中间偏进步","Tengah-progresif","ცენტრისტულ-პროგრესული","Centro progresista","中道進歩派","중도진보"),
"Center-Conservative": translateAllLocales("Центр-консервативные","Mitte-konservativ","Centre conservateur","中间偏保守","Tengah-konservatif","ცენტრისტულ-კონსერვატიული","Centro conservador","中道保守派","중도보수"),
"Conservative": translateAllLocales("Консервативные","Konservativ","Conservateur","保守主义","Konservatif","კონსერვატიული","Conservador","保守的","보수"),
"Far Conservative": translateAllLocales("Крайне консервативные","Stark konservativ","Très conservateur","极端保守主义","Sangat konservatif","უკიდურესად კონსერვატიული","Muy conservador","極めて保守的","극보수"),
"Far Libertarian": translateAllLocales("Крайние либертарианцы","Stark libertär","Très libertaire","极端自由意志主义","Sangat libertarian","უკიდურესად ლიბერტარიანული","Muy libertario","極端なリバタリアン","극자유지상주의"),
"Libertarian": translateAllLocales("Либертарианцы","Libertär","Libertaire","自由意志主义","Libertarian","ლიბერტარიანული","Libertario","リバタリアン","자유지상주의"),
"Libertarian-Leaning": translateAllLocales("С уклоном в либертарианство","Eher libertär","À tendance libertaire","偏自由意志主义","Cenderung libertarian","ლიბერტარიანიზმისკენ მიდრეკილი","De tendencia libertaria","リバタリアン寄り","자유지상주의 성향"),
"Authoritarian-Leaning": translateAllLocales("С уклоном в авторитаризм","Eher autoritär","À tendance autoritaire","偏威权主义","Cenderung otoriter","ავტორიტარიზმისკენ მიდრეკილი","De tendencia autoritaria","権威主義寄り","권위주의 성향"),
"Authoritarian": translateAllLocales("Авторитарные","Autoritär","Autoritaire","威权主义","Otoriter","ავტორიტარული","Autoritario","権威主義的","권위주의"),
"Far Authoritarian": translateAllLocales("Крайне авторитарные","Stark autoritär","Très autoritaire","极端威权主义","Sangat otoriter","უკიდურესად ავტორიტარული","Muy autoritario","極めて権威主義的","극권위주의"),
// Voting position names and government-role options produced by data modules.
"Strongly For": translateAllLocales("Категорически за","Stark dafür","Tout à fait pour","强烈赞成","Sangat setuju","მტკიცედ მომხრე","Totalmente a favor","強く賛成","강력 찬성"),
"Mostly For": translateAllLocales("Скорее за","Eher dafür","Plutôt pour","倾向赞成","Cenderung setuju","უფრო მომხრე","Más bien a favor","おおむね賛成","대체로 찬성"),
"Mostly Against": translateAllLocales("Скорее против","Eher dagegen","Plutôt contre","倾向反对","Cenderung menolak","უფრო წინააღმდეგი","Más bien en contra","おおむね反対","대체로 반대"),
"Strongly Against": translateAllLocales("Категорически против","Stark dagegen","Tout à fait contre","强烈反对","Sangat menolak","მტკიცედ წინააღმდეგი","Totalmente en contra","強く反対","강력 반대"),
"Custom probability": translateAllLocales("Пользовательская вероятность","Benutzerdefinierte Wahrscheinlichkeit","Probabilité personnalisée","自定义概率","Probabilitas khusus","მორგებული ალბათობა","Probabilidad personalizada","カスタム確率","사용자 지정 확률"),
"Confidence & supply": translateAllLocales("Доверие и бюджетная поддержка","Vertrauen und Tolerierung","Confiance et soutien sans participation","信任与供给支持","Kepercayaan dan dukungan","ნდობა და მხარდაჭერა","Confianza y apoyo parlamentario","閣外協力","신임 및 예산 지원"),
"Independent supporter": translateAllLocales("Независимый сторонник","Unabhängiger Unterstützer","Soutien indépendant","独立支持者","Pendukung independen","დამოუკიდებელი მხარდამჭერი","Apoyo independiente","独立支持者","독립 지지자"),
// Other voting-result phrases emitted by the calculation layer.
"all seats": translateAllLocales("все места","alle Sitze","tous les sièges","全部席位","semua kursi","ყველა ადგილი","todos los escaños","全議席","전체 의석"),
"deputies present": translateAllLocales("присутствующие депутаты","anwesende Abgeordnete","députés présents","出席议员","anggota hadir","დამსწრე დეპუტატები","diputados presentes","出席議員","출석 의원"),
"valid votes (For + Against)": translateAllLocales("действительные голоса (за + против)","gültige Stimmen (Dafür + Dagegen)","suffrages valides (pour + contre)","有效票（赞成 + 反对）","suara sah (Setuju + Menolak)","ნამდვილი ხმები (მომხრე + წინააღმდეგი)","votos válidos (a favor + en contra)","有効票（賛成＋反対）","유효 투표(찬성 + 반대)"),
"at least": translateAllLocales("не менее","mindestens","au moins","至少","setidaknya","არანაკლებ","al menos","以上","이상"),
"more than": translateAllLocales("более","mehr als","plus de","超过","lebih dari","მეტი ვიდრე","más de","超過","초과"),
"Simple majority: more votes For than Against": translateAllLocales("Простое большинство: голосов «за» больше, чем «против»","Einfache Mehrheit: mehr Dafür- als Dagegen-Stimmen","Majorité simple : plus de voix pour que contre","简单多数：赞成票多于反对票","Mayoritas sederhana: suara setuju lebih banyak daripada menolak","უბრალო უმრავლესობა: მომხრე ხმები მეტია, ვიდრე მოწინააღმდეგე","Mayoría simple: más votos a favor que en contra","単純過半数：賛成票が反対票を上回る","단순 과반수: 찬성이 반대보다 많음"),
"Absolute majority": translateAllLocales("Абсолютное большинство","Absolute Mehrheit","Majorité absolue","绝对多数","Mayoritas absolut","აბსოლუტური უმრავლესობა","Mayoría absoluta","絶対多数","절대 과반수"),
"Qualified majority": translateAllLocales("Квалифицированное большинство","Qualifizierte Mehrheit","Majorité qualifiée","特别多数","Mayoritas khusus","კვალიფიციური უმრავლესობა","Mayoría cualificada","特別多数","특별 다수"),
"Two-thirds majority": translateAllLocales("Большинство в две трети","Zwei-Drittel-Mehrheit","Majorité des deux tiers","三分之二多数","Mayoritas dua pertiga","ორი მესამედის უმრავლესობა","Mayoría de dos tercios","3分の2の多数","3분의 2 다수"),
"Three-fifths majority": translateAllLocales("Большинство в три пятых","Drei-Fünftel-Mehrheit","Majorité des trois cinquièmes","五分之三多数","Mayoritas tiga perlima","სამი მეხუთედის უმრავლესობა","Mayoría de tres quintos","5分の3の多数","5분의 3 다수"),
"Custom rule": translateAllLocales("Пользовательское правило","Benutzerdefinierte Regel","Règle personnalisée","自定义规则","Aturan khusus","მორგებული წესი","Regla personalizada","カスタムルール","사용자 지정 규칙"),
});
