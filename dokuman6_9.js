async function isebaslamegitimcikti()
{
    let isebaslamaveri = JSON.parse(store.get('isebaslamaveri') || '{}');
    let konusecim = isebaslamaveri.secimler || [];
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    let calisanliste = store.get('calisansecimjsonx');
    calisanliste = JSON.parse(calisanliste);
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: ".................", u: "................." }];
    }
    let isyeriismi = isyeri.fi;
    let isyeriadresi = isyeri.ad;
    let isyerisicil = isyeri.sc;
    let isveren = isyeri.is;
    let egitici = isebaslamaveri.adsoyad;
    if (!egitici || egitici.trim() === "")
    {
        egitici = ".................";
    };
    let egitimtarihi = isebaslamaveri.tarih;
    if (!egitimtarihi || egitimtarihi.trim() === "")
    {
        egitimtarihi = "......./......./20....";
    };
    var tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli"};
    let tehlikesinifi = tehlikesinifimap[isyeri.ts];
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } = docx;
    const egitimkonulari={sa:"Acil çıkış yolları, kapıları ve toplanma alanı",sb:"Çalışan temsilcisi ile tanışma",sc:"Kimyasal madde riski ve önlemi",sd:"Gürültü riski ve önlemi",se:"Toz riski ve önlemi",sf:"Kullanılması gerekli kişisel koruyucu donanımlar",sg:"Kaldırma ve taşıma işlerinde uyulacak kurallar",sh:"İş ekipmanlarının kullanımında uyulacak kurallar",si:"Güvenlik ve sağlık işaretlerinin tanıtımı",sj:"Kişisel ve el hijyeni"};
    let sayac = 0;
    const secilenSatirlar = konusecim.filter(item => Object.values(item)[0] === 1).map((item, index) =>
    {
        const key = Object.keys(item)[0];
        const konu = egitimkonulari[key] || "-";
        sayac = sayac + 1;
        const no = sayac.toString();
        return new docx.TableRow({
        children:
        [
            new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children:[new docx.TextRun({text:no,font:"Calibri",size:22})]})]}),
            new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,children:[new docx.Paragraph({children:[new docx.TextRun({text:konu,font:"Calibri",size:22})]})]}),
            new docx.TableCell({verticalAlign:docx.VerticalAlign.CENTER,verticalMerge:index===0?"restart":"continue",children:index===0?[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"2 Saat",font:"Calibri",size:22, bold: true})]})]:[]})
        ]});
    });
    const egitimtabloicerik = new docx.Table({
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        margins: {top: 70, bottom: 70, left: 50, right: 50,},
        rows:
        [
            new docx.TableRow({
              children: [
                new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,width:{size:8,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"No",bold:true,font:"Calibri",size:22})]})]}),
                new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,width:{size:70,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Eğitim Konusu",bold:true,font:"Calibri",size:22, alignment: docx.AlignmentType.CENTER})]})]}),
                new docx.TableCell({verticalAlign: docx.VerticalAlign.CENTER,width:{size:22,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Eğitim Süresi",bold:true,font:"Calibri",size:22, alignment: docx.AlignmentType.CENTER})]})]})
              ]
            }),
            ...secilenSatirlar
        ]
    });
    const sections = calisanliste.map(calisan =>
    ({
        properties: { page: { margin: { top: 1417, right: 1134, bottom: 1417, left: 1134 } } },
        children:
        [
            new Paragraph({ children: [new TextRun({ text: "İŞE BAŞLAMA EĞİTİM BELGESİ", bold: true, font: "Calibri", size: 28 })], spacing: { after: 250 }, alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new TextRun({ text: "\tİşyeri Unvanı: " + isyeriismi, font: "Calibri", size: 22 })], spacing: { after: 100 } }),
            ...(isyeriadresi && isyeriadresi.trim() !== "" ? [new Paragraph({ children: [new TextRun({ text: "\tİşyeri Adresi: " + isyeriadresi, font: "Calibri", size: 22 })], spacing: { after: 100 } })] : []),
            ...(isyerisicil && isyerisicil.trim() !== "" ? [new Paragraph({ children: [new TextRun({ text: "\tSGK Sicil No: " + isyerisicil, font: "Calibri", size: 22 })], spacing: { after: 100 } })] : []),
            new Paragraph({ children: [new TextRun({ text: "\tTehlike Sınıfı: " + tehlikesinifi, font: "Calibri", size: 22 })], spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tEğitim Tarihi: " + egitimtarihi, font: "Calibri", size: 22 })], spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAşağıda belirtilen konuları içeren işe başlama eğitimi, çalışan ile uygulamalı olarak yüz yüze gerçekleştirilmiştir. Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik Madde-6 kapsamında iş sağlığı ve güvenliği temel eğitimi, yıllık eğitim planında belirtilen tarihler arasında verilecektir.", font: "Calibri", size: 22 })], spacing: { after: 100 }, alignment: AlignmentType.JUSTIFIED}),
            egitimtabloicerik,
            new Paragraph(''),
            new Paragraph(''),
            isebaslamaegitimiimza(isveren, calisan.a, calisan.u, egitici)
        ]
    }));

    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "İşe Başlama Eğitimi.docx");
}
function isebaslamaegitimiimza(isveren, calisanadsoyad, calisanunvan, egitici)
{
return new docx.Table
({
    width: { size: 100, type: docx.WidthType.PERCENTAGE },
    borders:{top:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},bottom:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},left:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},right:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"}},
    rows:
    [
        new docx.TableRow
        ({
            children:
            [
                new docx.TableCell({ width: { size: 33, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: egitici, font: "Calibri", size: 22, bold: true })] })] }),
                new docx.TableCell({ width: { size: 34, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: isveren, font: "Calibri", size: 22, bold: true })] })] }),
                new docx.TableCell({ width: { size: 33, type: docx.WidthType.PERCENTAGE }, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: calisanadsoyad, font: "Calibri", size: 22, bold: true })] })] }),
            ]
        }),
        new docx.TableRow
        ({
            children:
            [
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Eğitici",font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İşveren",font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({text: calisanunvan, font: "Calibri", size: 22})]})]}),
            ]
        }),
        new docx.TableRow
        ({
            children:
            [
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İmza",font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İmza",font:"Calibri",size:22})]})]}),
                new docx.TableCell({children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "İmza", font: "Calibri", size: 22})]})]}),
            ]
        }),
    ]
})}

function isgegitimsertifikakontrol()
{
    $('#loading').show();
    $.when(isgegitimsertifikayaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

async function isgegitimsertifikayaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let uzmankurum = store.get("uzmankurum");
    if (uzmankurum)
    {
        uzmankurum = "Eğitimi Veren Kurumun Unvanı: " + uzmankurum;
    }
    let isgegitimveri = store.get('isgegitimveri');
    isgegitimveri = JSON.parse(isgegitimveri || '{}');
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri || '{}');
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e)
        {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: "", u: "" }];
    }
    let isyeriismi = isyeri.fi;
    let isverenvekili = isyeri.is;
    let toplamgun = isgegitimveri.toplamgun || "1";
    let toplamsaat = isgegitimveri.saat || "1";
    let egitimyeri = isgegitimveri.egitimyeri || "Örgün";
    let katilimtarih = temeltarihbul(isgegitimveri);
    let sure1 = temelegitimsuregun("1", parseInt(toplamgun) || 1, toplamsaat);
    let sure2 = temelegitimsuregun("2", parseInt(toplamgun) || 1, toplamsaat);
    let sure3 = temelegitimsuregun("3", parseInt(toplamgun) || 1, toplamsaat);
    let sure4 = temelegitimsuregun("4", parseInt(toplamgun) || 1, toplamsaat);
    let sertifikasaat = temelsertifikasaat(sure1, sure2, sure3, sure4, parseInt(toplamgun));
    let isgegitimkod = isgegitimveri.isgegitimkod || "00000000";
    const onsayfa = calisanliste.map((calisan, index) =>
    {
        const content = [
            { text: 'İŞ SAĞLIĞI ve GÜVENLİĞİ', style: 'ustbaslik', margin: [0, 50, 0, 10] },
            { text: 'EK-2 TEMEL EĞİTİM BELGESİ', style: 'ustbaslik', margin: [0, 0, 0, 20] },
            { text: 'İşyeri Unvanı: ' + isyeriismi, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Katılımcı Adı Soyadı: ' + calisan.a, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Katılımcının Görev Unvanı: ' + calisan.u, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Tarih: ' + katilimtarih, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Eğitim Süresi: ' + sertifikasaat, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Eğitim Şekli: ' + egitimyeri, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Yukarıda adı ve soyadı yazılı çalışan, Çalışanların  İş  Sağlığı  ve  Güvenliği  Eğitimlerinin  Usul  ve  Esasları  Hakkında  Yönetmelik', style: 'normalsatir', margin: [90, 0, 50, 5] },
            { text: 'kapsamında verilen iş sağlığı ve güvenliği eğitimlerini başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.', style: 'normalsatir', margin: [50, 0, 0, 165] },
            temelimzatablo(uzmanad, isverenvekili, hekimad, uzmanno, hekimno, uzmankurum)
        ];
        if (index < calisanliste.length - 1)
        {
            content.push({ text: '', pageBreak: 'after' });
        }
    return content;
    }).flat();

    const ilksayfa = {
        pageOrientation: 'landscape',
        content: onsayfa,
        styles:
        {
            ustbaslik: { fontSize: 14, bold: true, alignment: "center" },
            normalsatir: { fontSize: 11, alignment: 'justify' },
        }
    };
    sertifikaarkaplan(ilksayfa);
    const arkaicerik = calisanliste.map((calisan, index) => {
        return [
            temelisgkonutablo(isgegitimkod),
            { text: '', pageBreak: (index < calisanliste.length - 1) ? 'after' : undefined }
        ];
    }).flat();
    const ikincisayfa =
    {
        pageOrientation: 'portrait',
        content: arkaicerik,
        defaultStyle:
        {
            font: 'Roboto',
            fontSize: 11
        },
        pageMargins: [30, 30, 30, 30],
    };
    const { PDFDocument } = PDFLib;
    const pdf1Buffer = await temelpdfolusturma(ilksayfa);
    const pdf2Buffer = await temelpdfolusturma(ikincisayfa);
    const pdf1Doc = await PDFDocument.load(pdf1Buffer);
    const pdf2Doc = await PDFDocument.load(pdf2Buffer);
    const mergedPdf = await PDFDocument.create();
    const pages1 = await mergedPdf.copyPages(pdf1Doc, pdf1Doc.getPageIndices());
    const pages2 = await mergedPdf.copyPages(pdf2Doc, pdf2Doc.getPageIndices());
    const maxLength = Math.max(pages1.length, pages2.length);
    for (let i = 0; i < maxLength; i++)
    {
        if (pages1[i]) mergedPdf.addPage(pages1[i]);
        if (pages2[i]) mergedPdf.addPage(pages2[i]);
    }
    const finalBytes = await mergedPdf.save();
    const blob = new Blob([finalBytes], { type: "application/pdf" });
    saveAs(blob, "Sertifika.pdf");
}



function temelisgkonutablo(i){const{konular:t,basliklar:n}=temelisgtumkonular(i),e=[];e.push([{text:"EĞİTİM KONULARI",colSpan:2,alignment:"center",bold:!0,fontSize:12},{}]);let l=0,a=1,o="1.";for(let i=0;i<t.length;i++){if(l<n.length&&i===n[l].index){e.push([{text:n[l].title,colSpan:2,alignment:"center",bold:!0},{}]),o=l+1+".",a=1,l++}e.push([{text:o+a,alignment:"center"},{text:t[i],alignment:"left"}]),a++}return{table:{headerRows:1,widths:["10%","90%"],body:e},layout:{hLineWidth:function(i,t){return 0===i||i===t.table.body.length?1:.5},vLineWidth:function(){return.5},hLineColor:function(){return"#aaa"},vLineColor:function(){return"#aaa"},paddingLeft:function(){return 5},paddingRight:function(){return 5},paddingTop:function(){return 5},paddingBottom:function(){return 5}}}}
async function temelpdfolusturma(docDefinition){return new Promise((resolve, reject) => {pdfMake.createPdf(docDefinition).getBuffer((buffer) => {resolve(buffer);});});}
function temelisgtumkonular(i){const e=["Çalışma mevzuatı ile ilgili bilgiler","Çalışanların yasal hak ve sorumlulukları","İşyeri temizliği ve düzeni","İş kazası ve meslek hastalığından doğan hukuki sonuçlar","Meslek hastalıklarının sebepleri","Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması","Biyolojik ve psikososyal risk etmenleri","İlkyardım","Tütün ürünlerinin zararları ve pasif etkilenim","Kimyasal, fiziksel ve ergonomik risk etmenleri","Elle kaldırma ve taşıma","Parlama, patlama, yangın ve yangından korunma","İş ekipmanlarının güvenli kullanımı","Ekranlı araçlarla çalışma","Elektrik tehlikeleri, riskleri ve önlemleri","Güvenlik ve sağlık işaretleri","İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması","Kişisel koruyucu donanım kullanımı","İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü","Tahliye ve kurtarma"],t=["Yapı işlerinde tehlikeler, riskler ve önlemler","Radyosyon, tehlikeleri, riskleri ve önlemleri","Trafik kuralları ve güvenli sürüş teknikleri","Malzeme güvenlik bilgi formları","Kapalı ortamda çalışma","Kaynakla çalışma","Yüksekte çalışma","Hijyen Eğitimi"],n=[...e];for(let e=0;e<i.length&&e<t.length;e++)"1"===i[e]&&n.push(t[e]);const o=[{index:0,title:"GENEL KONULAR"},{index:4,title:"SAĞLIK KONULARI"},{index:9,title:"TEKNİK KONULAR"},{index:20,title:"DİĞER KONULAR"}];return{konular:n,basliklar:o}}
function temelimzatablo(a, b, c, d, e, f) { return { table: { widths: [47, 207, 207, 207, 47], body: [["", { text: a, alignment: "center", fontSize: 11, bold: !0 }, { text: b, alignment: "center", fontSize: 11, bold: !0 }, { text: c, alignment: "center", fontSize: 11, bold: !0 }, ""], ["", { text: "İş Güvenliği Uzmanı", alignment: "center", fontSize: 11 }, { text: "İşveren Vekili", alignment: "center", fontSize: 11 }, { text: "İşyeri Hekimi", alignment: "center", fontSize: 11 }, ""], ["", { text: "Belge No: " + d, alignment: "center", fontSize: 11 }, "", { text: "Belge No: " + e, alignment: "center", fontSize: 11 }, ""], [{ colSpan: 5, text: f, alignment: "center", fontSize: 9 }, "", "", "", ""]] }, layout: "noBorders" } }
function temeltarihbul(v) { const t = "....../....../202....", a = v.tarih1 || t, b = v.tarih2 || t, c = v.tarih3 || t, d = v.tarih4 || t, g = parseInt(v.toplamgun) || 1; switch (g) { case 1: return a; case 2: return `${a} - ${b}`; case 3: return `${a} - ${b} - ${c}`; case 4: return `${a} - ${b} - ${c} - ${d}`; default: return a } }
function temelegitimsuregun(h, t, s) { let r = ""; if (s === "8 Saat") { if (h === "1" && t === 1) r = "8 Saat"; else if (t === 2 && ["1", "2"].includes(h)) r = "4 Saat"; else if (t === 3) { if (h === "1") r = "4 Saat"; if (["2", "3"].includes(h)) r = "2 Saat" } else if (t === 4 && ["1", "2", "3", "4"].includes(h)) r = "2 Saat" } else if (s === "12 Saat") { if (t === 2) { if (h === "1") r = "4 Saat"; if (h === "2") r = "8 Saat" } else if (t === 3 && ["1", "2", "3"].includes(h)) r = "4 Saat"; else if (t === 4) { if (["1", "2"].includes(h)) r = "2 Saat"; if (["3", "4"].includes(h)) r = "4 Saat" } } else if (s === "16 Saat") { if (t === 2 && ["1", "2"].includes(h)) r = "8 Saat"; else if (t === 3) { if (h === "1") r = "8 Saat"; if (["2", "3"].includes(h)) r = "4 Saat" } else if (t === 4 && ["1", "2", "3", "4"].includes(h)) r = "4 Saat" } return r; }
function temelsertifikasaat(s1, s2, s3, s4, g) { let s = "", t = 16; for (let i = 0; i < g; i++) { try { if (i === 0) { s = s1; t = parseInt(s1.replace(" Saat", "")) } else if (i === 1) { s += " - " + s2; t += parseInt(s2.replace(" Saat", "")) } else if (i === 2) { s += " - " + s3; t += parseInt(s3.replace(" Saat", "")) } else if (i === 3) { s += " - " + s4; t += parseInt(s4.replace(" Saat", "")) } } catch (e) { } } return s + " (Toplam: " + t + " Saat)"; }
function temelkatılımlistesikontrol()
{
    $('#loading').show();
    $.when(temelkatılımlistesiyaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}



function temelkatılımlistesiyaz() {
     let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let uzmankurum = store.get("uzmankurum");
    if (uzmankurum) {
        uzmankurum = "Eğitimi Veren Kurumun Unvanı: " + uzmankurum;
    }
    let isgegitimveri = store.get('isgegitimveri');
    isgegitimveri = JSON.parse(isgegitimveri || '{}');
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri || '{}');
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let bossatir = isgegitimveri.bossatir;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e) {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0) {
        calisanliste = Array.from({ length: 12 }, () => ({ ad: "", un: "" }));
    }
    else if (bossatir > 0)
    {
        calisanliste = calisanliste.concat(Array.from({ length: bossatir }, () => ({ ad: "", un: "" })));
    }
    let isyeriismi = isyeri.fi;
    let toplamsaat = isgegitimveri.saat || "1";
    let egitimyeri = isgegitimveri.egitimyeri || "İşyeri";
    let isgegitimkod = isgegitimveri.isgegitimkod || "00000000";
    let toplamgun = isgegitimveri.toplamgun || "1";
    let sure1 = temelegitimsuregun("1", parseInt(toplamgun) || 1, toplamsaat);
    let sure2 = temelegitimsuregun("2", parseInt(toplamgun) || 1, toplamsaat);
    let sure3 = temelegitimsuregun("3", parseInt(toplamgun) || 1, toplamsaat);
    let sure4 = temelegitimsuregun("4", parseInt(toplamgun) || 1, toplamsaat);
    let tarih1 = isgegitimveri.tarih1 || "......./......./20....";
    let tarih2 = isgegitimveri.tarih2 || "......./......./20....";
    let tarih3 = isgegitimveri.tarih3 || "......./......./20....";
    let tarih4 = isgegitimveri.tarih4 || "......./......./20....";
    let konugun1 = katılımkonugun(1, parseInt(toplamgun) || 1, isgegitimkod);
    let konugun2 = katılımkonugun(2, parseInt(toplamgun) || 1, isgegitimkod);
    let konugun3 = katılımkonugun(3, parseInt(toplamgun) || 1, isgegitimkod);
    let konugun4 = katılımkonugun(4, parseInt(toplamgun) || 1, isgegitimkod);

    const katilimlistesi = {
        pageMargins: [25, 25, 25, 25],
        content: []
    };

    function createParticipantTable(startIndex, endIndex, gunNo)
    {
    let tableBody = []; 
    let tarih, konu, sure;
    switch(gunNo) {
        case 1:
            tarih = tarih1;
            konu = konugun1;
            sure = sure1;
            break;
        case 2:
            tarih = tarih2;
            konu = konugun2;
            sure = sure2;
            break;
        case 3:
            tarih = tarih3;
            konu = konugun3;
            sure = sure3;
            break;
        case 4:
            tarih = tarih4;
            konu = konugun4;
            sure = sure4;
            break;
        default:
            tarih = tarih1;
            konu = konugun1;
            sure = sure1;
    }
    tableBody.push(...katilimustbilgi(isyeriismi, tarih, egitimyeri, sure, konu));
    for (let i = startIndex; i < endIndex; i++) {
        const calisan = calisanliste[i];
        tableBody.push([
            { text: (i + 1).toString(), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: calisan.ad || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: calisan.un || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: ''}
        ]);
    }
    tableBody.push(
        [
            { text: uzmanad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
            { text: ''},
            { text: hekimad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
            { text: ''},
        ],
        [
            { text: 'İş Güvenliği Uzmanı - Belge No: ' + uzmanno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
            { text: '' },
            { text: 'İşyeri Hekimi - Belge No: ' + hekimno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
            { text: ''},
        ],
        [
            { text: '', colSpan: 2, margin: [25, 25] },
            { text: '' },
            { text: '', colSpan: 2, margin: [25, 25] },
            { text: ''},
        ]
    );    
    return {
        table: {
            widths: [25, "*", "auto", 100],
            body: tableBody
        },
    };
    }
    const chunkSize = 12;
    for (let gun = 1; gun <= parseInt(toplamgun); gun++) {
        for (let i = 0; i < calisanliste.length; i += chunkSize) {
            const endIndex = Math.min(i + chunkSize, calisanliste.length);
        
            katilimlistesi.content.push(createParticipantTable(i, endIndex, gun));
        
            if (endIndex < calisanliste.length) {
                katilimlistesi.content.push({ text: '', pageBreak: 'after' });
            }
        }
        if (gun < parseInt(toplamgun)) {
            katilimlistesi.content.push({ text: '', pageBreak: 'after' });
        }
    }
    pdfMake.createPdf(katilimlistesi).getBlob(function(blob) {
        saveAs(blob, 'Katılım Listesi.pdf');
    });
}

function temelkatılımlistesiyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isgegitimveri = store.get('isgegitimveri');
    isgegitimveri = JSON.parse(isgegitimveri || '{}');
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri || '{}');
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let bossatir = isgegitimveri.bossatir;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e)
        {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = Array.from({ length: 12 }, () => ({ a: "", u: "" }));
    }
    else if (bossatir > 0)
    {
        calisanliste = calisanliste.concat(Array.from({ length: bossatir }, () => ({ a: "", u: "" })));
    }
    let isyeriismi = isyeri.fi;
    let toplamsaat = isgegitimveri.saat || "1";
    let egitimyeri = isgegitimveri.egitimyeri || "İşyeri";
    let isgegitimkod = isgegitimveri.isgegitimkod || "00000000";
    let toplamgun = isgegitimveri.toplamgun || "1";
    let sure1 = temelegitimsuregun("1", parseInt(toplamgun) || 1, toplamsaat);
    let sure2 = temelegitimsuregun("2", parseInt(toplamgun) || 1, toplamsaat);
    let sure3 = temelegitimsuregun("3", parseInt(toplamgun) || 1, toplamsaat);
    let sure4 = temelegitimsuregun("4", parseInt(toplamgun) || 1, toplamsaat);
    let tarih1 = isgegitimveri.tarih1 || "......./......./20....";
    let tarih2 = isgegitimveri.tarih2 || "......./......./20....";
    let tarih3 = isgegitimveri.tarih3 || "......./......./20....";
    let tarih4 = isgegitimveri.tarih4 || "......./......./20....";
    let konugun1 = katılımkonugun(1, parseInt(toplamgun) || 1, isgegitimkod);
    let konugun2 = katılımkonugun(2, parseInt(toplamgun) || 1, isgegitimkod);
    let konugun3 = katılımkonugun(3, parseInt(toplamgun) || 1, isgegitimkod);
    let konugun4 = katılımkonugun(4, parseInt(toplamgun) || 1, isgegitimkod);

    const katilimlistesi = {
        pageMargins: [25, 25, 25, 25],
        content: []
    };

    function createParticipantTable(startIndex, endIndex, gunNo)
    {
    let tableBody = []; 
    let tarih, konu, sure;
    switch(gunNo) {
        case 1:
            tarih = tarih1;
            konu = konugun1;
            sure = sure1;
            break;
        case 2:
            tarih = tarih2;
            konu = konugun2;
            sure = sure2;
            break;
        case 3:
            tarih = tarih3;
            konu = konugun3;
            sure = sure3;
            break;
        case 4:
            tarih = tarih4;
            konu = konugun4;
            sure = sure4;
            break;
        default:
            tarih = tarih1;
            konu = konugun1;
            sure = sure1;
    }
    tableBody.push(...katilimustbilgi(isyeriismi, tarih, egitimyeri, sure, konu));
    for (let i = startIndex; i < endIndex; i++) {
        const calisan = calisanliste[i];
        tableBody.push([
            { text: (i + 1).toString(), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: calisan.ad || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: calisan.un || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11]},
            { text: ''}
        ]);
    }
    tableBody.push(
        [
            { text: uzmanad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
            { text: ''},
            { text: hekimad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
            { text: ''},
        ],
        [
            { text: 'İş Güvenliği Uzmanı - Belge No: ' + uzmanno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
            { text: '' },
            { text: 'İşyeri Hekimi - Belge No: ' + hekimno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
            { text: ''},
        ],
        [
            { text: '', colSpan: 2, margin: [25, 25] },
            { text: '' },
            { text: '', colSpan: 2, margin: [25, 25] },
            { text: ''},
        ]
    );    
    return {
        table: {
            widths: [25, "*", "auto", 100],
            body: tableBody
        },
    };
    }
    const chunkSize = 12;
    for (let gun = 1; gun <= parseInt(toplamgun); gun++) {
        for (let i = 0; i < calisanliste.length; i += chunkSize) {
            const endIndex = Math.min(i + chunkSize, calisanliste.length);
        
            katilimlistesi.content.push(createParticipantTable(i, endIndex, gun));
        
            if (endIndex < calisanliste.length) {
                katilimlistesi.content.push({ text: '', pageBreak: 'after' });
            }
        }
        if (gun < parseInt(toplamgun)) {
            katilimlistesi.content.push({ text: '', pageBreak: 'after' });
        }
    }
    pdfMake.createPdf(katilimlistesi).getBlob(function(blob) {
        saveAs(blob, 'Katılım Listesi.pdf');
    });
}


function katılımkonugun(hangigun, toplamgun, isgegitimkod) {
    let veri = "", json = { egitimkonusu: ["Çalışma mevzuatı ile ilgili bilgiler", "Çalışanların yasal hak ve sorumlulukları", "İşyeri temizliği ve düzeni", "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "Meslek hastalıklarının sebepleri", "Hastalıktan korunma prensipleri ve korunma tekniklerinin uygulanması", "Biyolojik ve psikososyal risk etmenleri", "İlkyardım", "Tütün ürünlerinin zararları ve pasif etkilenim", "Kimyasal, fiziksel ve ergonomik risk etmenleri", "Elle kaldırma ve taşıma", "Parlama, patlama, yangın ve yangından korunma", "İş ekipmanlarının güvenli kullanımı", "Ekranlı araçlarla çalışma", "Elektrik tehlikeleri, riskleri ve önlemleri", "Güvenlik ve sağlık işaretleri", "İş kazalarının sebepleri ve korunma prensipleri ile tekniklerinin uygulanması", "Kişisel koruyucu donanım kullanımı", "İş sağlığı ve güvenliği genel kuralları ve güvenlik kültürü", "Tahliye ve kurtarma"] }, ekKonular = ["Yapı işlerinde tehlikeler, riskler ve önlemler", "Radyasyon, tehlikeleri, riskleri ve önlemleri", "Trafik kuralları ve güvenli sürüş teknikleri", "Malzeme güvenlik bilgi formları", "Kapalı ortamda çalışma", "Kaynakla çalışma", "Yüksekte çalışma", "Hijyen Eğitimi"];
    if (hangigun > toplamgun) return veri;
    for (let i = 0; i < isgegitimkod.length && i < ekKonular.length; i++) if (isgegitimkod[i] === '1') json.egitimkonusu.push(ekKonular[i]);
    let son = json.egitimkonusu.length, basla = 9, parca = (son - basla) / (toplamgun - 1), startIndex = hangigun === 1 ? 0 : basla + (parca * (hangigun - 2)), endIndex = hangigun === 1 ? basla : startIndex + parca;
    return veri = toplamgun === 1 ? json.egitimkonusu.join(", ") : json.egitimkonusu.slice(startIndex, endIndex).join(", ");
}

function katilimustbilgi(i, t, e, s, k) {
    return [
        [{ text: 'TEMEL İŞ SAĞLIĞI ve GÜVENLİĞİ EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: `İşyeri Unvanı: ${i}`, colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2] }, '', '', ''],
        [{ colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2], text: [{ text: `Eğitim Tarihi: ${t}\t\t\t\tEğitim Şekli: ${e}\t\t\t\tSüresi: ${s}` }] }, '', '', ''],
        [{ text: 'EĞİTİM KONULARI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: k, colSpan: 4, alignment: 'justify', fontSize: 10, margin: [0, 5] }, '', '', ''],
        [{ text: 'Sıra', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Ad Soyad', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Unvan', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'İmza', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }]
    ];
}


async function temelsinavsorusu()
{
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch
        {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0) {
        calisanliste = Array.from({ length: 1 }, () => ({ a: ""}));
    }
    const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, VerticalAlign, HeightRule } = docx;
    let sinavjson = {"yuksektecalisma":[{"soru":"Yüksekten çalışma sırasında aşağıda belirtilen hangi güvenlik önlemi doğrudur?","dogru":"Yüksekte çalışırken mutlaka emniyet kemeri takılmalı ve güvenli bir noktaya bağlanmalıdır.","yanlis1":"Yüksekte çalışırken yalnızca dengeye dikkat etmek yeterlidir, ek bir güvenlik ekipmanına gerek yoktur.","yanlis2":"Yüksekte çalışırken hızlı hareket ederek işi bir an önce tamamlamak en güvenli yöntemdir.","yanlis3":"Yüksekte çalışma sırasında rüzgarlı hava koşulları varsa, çalışmaya devam edilir."},{"soru":"Yüksekte yapılan çalışmalara ilişkin aşağıda verilen bilgilerden hangisi doğrudur?","dogru":"Yüksekte çalışırken paraşüt tipi emniyet kemeri takmamıza gerekir.","yanlis1":"Yağmurlu, karlı ve rüzgarlı havalarda yüksekte çalışmak güvenlidir.","yanlis2":"Yüksekte çalışırken yukarıdan aşağıya malzeme atabiliriz.","yanlis3":"Yüksekte çalışırken, yüksekten düşmemizi engelleyen korkulukları istediğimiz zaman çıkarabiliriz."},{"soru":"Yapı/İnşaat işlerine ilişkin aşağıda verilen bilgilerden hangisi yanlıştır?","dogru":"Yapı alanına işi olmayan kişilerin girişi engellenmelidir.","yanlis1":"Sahada dolaşırken baret takmaya ve iş ayakkabısı giymeye gerek yoktur.","yanlis2":"Kazı alanının etrafı çevrilmeli ve uyarı levhaları konulmalıdır.","yanlis3":"İskelede çalışırken, uzanmak veya başka bir sebepten ötürü dışarıya uzanmamalıyız."}],"bakim":[{"soru":"Bakım onarım işleri ile ilgili aşağıda verilen bilgilerden hangisi yanlıştır?","dogru":"Bakım/onarım konusunda mesleki yeterliliğe sahip olan çalışanlar bu işi yapabilir.","yanlis1":"Bakım/onarım işinin yapıldığı alana meraklı olan kişiler girebilir ve işe yardımcı olabilir.","yanlis2":"Bakım/onarım işlemi sırasında ekipmanın acil stop butonuna basılmalı ve elektrik bağlantısı sökülmelidir.","yanlis3":"Bakım/onarım işlemi sırasında 'Dikkat Bakım Var' levhası asılmalıdır."}],"elektrik":[{"soru":"Elektrik ile ilgili aşağıda verilen güvenlik tedbirlerinden hangisi yanlıştır?","dogru":"Hasar görmüş veya kesilmiş elektrik kablosunu bantlayarak kullanmaya devam edebiliriz.","yanlis1":"Her türlü elektrikli ekipmana müdahale etmeden önce elektriği kesmemiz gerekir.","yanlis2":"Elektrik kesilmiş olsa dahi elektrik kesilip kesilmediği kontrol etmeden işe başlamamalıyız.","yanlis3":"Elektrik sistemlerinde topraklama, olası bir elektrik kaçağını toprağa verilmesini sağlayan güvenlik sistemidir."}],"isekipmani":[{"soru":"Aşağıda belirtilen iş ekipmanlarının kullanımına ilişkin bilgilerden hangisi yanlıştır?","dogru":"İş ekipmanları sadece tasarım ve imalat amacına uygun işler için kullanılmalıdır.","yanlis1":"İş ekipmanının arıza yapması halinde kimseye haber veremeden hemen müdahale edip onarmalıyız.","yanlis2":"El aletleri ile çalışmaya başlamadan önce kırık, çatlak veya yıpranma olup olmadığını kontrol etmeliyiz.","yanlis3":"İş ekipmanlarının üstünde yer alan uyarı ve ikazlara dikkat etmeliyiz ve buna göre çalışmalıyız."},{"soru":"Bir iş ekipmanını kullanırken aşağıdaki hareketlerden hangisinin yapılması yanlıştır?","dogru":"İş ekipmanı çok yıpranmış veya bozulmuş ise kullanılmamalıdır.","yanlis1":"İş ekipmanın koruyucu kapak ve donanımları işi yavaşlatıyorsa çıkartılabilir.","yanlis2":"İş ekipmanın kullanımı konusunda yeterli bilgiye sahip değilsek kullanamamalıyız.","yanlis3":"Tehlikeli bir durum oluştuğunda acil stop butonuna basılmalıdır."}],"tekniksoru":[{"soru":"Ergonomik risk etmenleri ile ilgili aşağıdaki bilgilerden hangisi yanlıştır?","dogru":"Bir yükü birden daha fazla kişi ile taşımak, tek olarak taşımaktan daha güvenlidir.","yanlis1":"Bir yükü kaldırma aracı ile değil öncelikle elle taşımalıyız.","yanlis2":"Uzun süreli oturmak, egzersiz yapmamak vücut kaslarımızın zayıflamasına sebep olur.","yanlis3":"Bir yükü elle taşırken yükü vücudumuza yakın tutmalıyız."},{"soru":"Acil durum çağrı merkezi telefon numarası aşağıdakilerinden hangisidir?","dogru":"112","yanlis1":"111","yanlis2":"110","yanlis3":"109"},{"soru":"İşyerinde çalışma alanı düzenine ilişkin aşağıdaki bilgilerden hangisi doğrudur?","dogru":"Düzenli çalışma alanı, iş kazalarını azaltır, verimliliği artırır ve çalışanların motivasyonunu olumlu etkiler.","yanlis1":"Düzenli bir çalışma alanı, yalnızca estetik görünüm sağlar.","yanlis2":"Çalışma zemininde bulunan kablolar herhangi bir tehlike oluşturmaz.","yanlis3":"Çalışma zemini ıslak veya kaygan vaziyette iken çalışmaya devam edilebilir."},{"soru":"Çalışma ortamında karşılaşabileceğiniz tehlikeli kimyasal maddelerle ilgili hangi önlem en doğru yaklaşımdır?","dogru":"Çalışmadan önce malzeme güvenlik bilgi formunu okunmalı ve uygun kişisel koruyucu donanım kullanılmalıdır.","yanlis1":"Kimyasal maddelere çıplak elle, eldiven takmadan temas etmekte sakınca yoktur.","yanlis2":"Kimyasal maddeler, havalandırılmayan veya kapalı bir ortamda güvenli şekilde kullanılabilir.","yanlis3":"Kimyasal maddeleri karıştırıp birleştirmek tehlikeli değildir."},{"soru":"Aşağıdakilerden hangisi kimyasal maddelerle güvenli çalışmanın temel kurallarındandır?","dogru":"Kimyasal maddeler uygun şekilde etiketlenmeli ve kapalı ortamlarda saklanmalıdır.","yanlis1":"Kimyasal maddeler çalışma alanında açık ve ulaşılabilir şekilde bırakılmalıdır.","yanlis2":"Kimyasallarla çalışırken eldiven, maske gibi koruyucuların kullanılması gerekli değildir.","yanlis3":"Kimyasal maddeler yiyeceklerle aynı dolapta saklanabilir, bu herhangi bir risk oluşturmaz."},{"soru":"Aşağıda fiziksel risk etmenleri ile verilen bilgilerden hangisi doğrudur?","dogru":"Yüksek ve uzun süreli gürültüye maruziyet işitme kaybına neden olabilir.","yanlis1":"Kimyasal madde buharlarının solunması risk oluşturmaz.","yanlis2":"Tozlu çalışma ortamında maske kullanmak zorunlu değildir.","yanlis3":"Ortam sıcaklığı, çalışma performansını etkilemez."},{"soru":"Elle kaldırma ve taşıma işlemlerinde aşağıdakilerden hangisi doğru bir uygulamadır?","dogru":"Yük, dizlerden destek alınarak ve bel düz tutulacak şekilde kaldırılmalıdır.","yanlis1":"Yük mümkün olduğunca uzaktan kavranmalı ve hızlıca kaldırılmalıdır.","yanlis2":"Yük taşırken ani dönme ve eğilme hareketleri yapılmalıdır.","yanlis3":"Ağır yükler tek başına ve aniden kaldırılmalıdır."},{"soru":"Aşağıdakilerden hangisi yangın riskini azaltmaya yönelik doğru bir uygulamadır?","dogru":"Yanıcı maddeler uygun kaplarda saklanmalı ve ateş kaynaklarından uzak tutulmalıdır.","yanlis1":"Yanıcı maddeler açıkta ve kontrolsüz şekilde depolanabilir.","yanlis2":"Elektrik kablolarının zarar görmesi yangın riski oluşturmaz.","yanlis3":"Yangın söndürme ekipmanlarının bakımına gerek yoktur."},{"soru":"Acil bir durumda yapılması uygun olmayan davranış aşağıdakilerden hangisidir? (yangın, deprem vb.)","dogru":"Acil durumda asansör kullanılarak tahliye yapılmasında sakınca yoktur.","yanlis1":"Acil çıkış işaretlerini takip ederek tahliye olmalıyız.","yanlis2":"Acil durum yolları ve çıkışları her zaman açık tutulmalı ve önüne bir malzeme koymamalıyız.","yanlis3":"Acil durum anında paniğe kapılmamalı ve soğukkanlılığımızı korumalıyız."},{"soru":"Aşağıdakilerden hangisi elektrikle çalışmalarda güvenliği sağlamaya yönelik doğru bir uygulamadır?","dogru":"Elektrik panoları kilitli olmalı ve yetkisiz kişilerin erişimi engellenmelidir.","yanlis1":"Elektrik kabloları açıkta ve suya yakın yerlerde bırakılabilir.","yanlis2":"Elektrik arızalarını herkesin müdahale edebilmesi için pano kapağı açık bırakılmalıdır.","yanlis3":"Islak ellerle elektrikli aletleri kullanmak güvenlik açısından sorun oluşturmaz."},{"soru":"Kişisel koruyucu donanımlarla ile ilgili aşağıdaki ifadelerden hangisi doğrudur?","dogru":"Kişisel koruyucu donanımlar, çalışanı tehlikeye karşı korumak amacıyla kullanılan ekipmanlardır.","yanlis1":"Yıpranmış veya bozulmuşta olsa kişisel koruyucu donanımı kullanmalıyız.","yanlis2":"Kişisel koruyucu donanımlar tehlikeleri ortadan kaldırdığı için başka hiçbir önleme gerek yoktur.","yanlis3":"Kişisel koruyucu donanımlar beden ölçülerimize uygun olmasada kullanılması sakınca yaratmaz."}],"genelsoru":[{"soru":"İş sağlığı ve güvenliğinin amacı aşağıdakilerden hangisi değildir?","dogru":"Mal ve hizmetin çok daha hızlı bir şekilde üretilmesini sağlamak.","yanlis1":"Çalışma ortamında bulunan tehlikeleri en aza indirmek.","yanlis2":"Çalışanların işin yürütümü sırasında meydana gelebilecek tehlikelerden korumak.","yanlis3":"İş kazası ve meslek hastalıklarını en aza indirmek."},{"soru":"İş sağlığı ve güvenliği kültürü ile ilgili aşağıdaki bilgilerden hangisi yanlıştır?","dogru":"İş sağlığı ve güvenliği kültüründe öncelik güvenlik değil işin bir an önce yapılmasıdır.","yanlis1":"İş sağlığı ve güvenliği eğitiminin bir amacı da iş güvenliği kültürünün gelişmesidir.","yanlis2":"İş sağlığı ve güvenliği kültürünün gelişmesinde devlet, işveren ve çalışanların rolü önemlidir.","yanlis3":"İş sağlığı ve güvenliği kültürünün gelişimi ile iş kazası ve meslek hastalıkları sayıca azalacaktır."},{"soru":"Çalışanların iş sağlığı ve güvenliği açısından yükümlülüğüne ilişkin aşağıdakilerden hangisi yanlıştır?","dogru":"Ciddi ve yakın hayati bir tehlike olsa dahi çalışmaya devam etmekle yükümlüdür.","yanlis1":"Her türlü iş ekipmanını amacına uygun ve güvenlik donanımlarıyla kullanmakla yükümlüdür.","yanlis2":"İş sağlığı ve güvenliği eğitimine ve güvenlik talimatlarına uygun şekilde çalışmakla yükümlüdür.","yanlis3":"Diğer çalışma arkadaşlarının sağlığını ve güvenliğini tehlikeye düşürmemekle yükümlüdür."},{"soru":"Yaralanmalı bir iş kazası meydana geldiğinde aşağıdaki davranışlardan hangisi yanlıştır?","dogru":"Hafif yaralanmalı bir kazaysa kimseye haber verilmemeli, aynı şekilde çalışmaya devam edilmelidir.","yanlis1":"İşveren vekiline yaralanmalı kaza ile ilgili derhal haber verilmelidir.","yanlis2":"Ağır yaralanmalı bir kaza ise derhal 112 acil durum çağrı merkezine haber verilmelidir.","yanlis3":"Yaralanan çalışana ilkyardım ekibi derhal ilk müdahaleyi yapmalıdır."},{"soru":"Aşağıdakilerden hangisi işyerinde temizlik ve düzenin sağlanmasının olumlu etkilerinden biridir?","dogru":"İş kazası risklerini azaltır ve çalışma verimliliğini artırır.","yanlis1":"Sadece işyerinin estetik görünmesini sağlar, iş güvenliği ile ilgisi yoktur.","yanlis2":"Çalışanların dikkatini dağıtır, iş verimini düşürür.","yanlis3":"Temizlik ve düzen, yöneticilerin sorumluluğunda olup çalışanları ilgilendirmez"},{"soru":"Aşağıdakilerden hangisi işyeri temizliği ve düzeniyle ilgili doğru bir uygulamadır?","dogru":"Çalışma bittikten sonra kullanılan ekipmanlar yerlerine kaldırılmalı ve alan temizlenmelidir.","yanlis1":"Çalışma alanında dökülen sıvılar kendi kendine kurur, hemen temizlemeye gerek yoktur.","yanlis2":"Temizlik işleri sadece temizlik çalışanın sorumluluğundadır, diğer çalışanların katkı sağlamasına gerek yoktur.","yanlis3":"Zemin üzerinde bulunan kabloların düzenlenmesine veya kaldırılmasına gerek yoktur."},{"soru":"Çalışma mevzuatı ile ilgili aşağıdaki bilgilerden hangisi doğrudur?","dogru":"Türkiye'de çalışma hayatını düzenleyen temel yasa 4857 sayılı İş Kanunudur.","yanlis1":"Haftalık çalışma süresi 60 saattir.","yanlis2":"Çalışanın genel sağlık durumu, işe uygun olup olmaması önemli değildir.","yanlis3":"Yeterli dinlenme sürelerinin iş sağlığı ve güvenliğiyle bir ilgisi yoktur."},{"soru":"İşveren ve çalışanların sorumlulukları ile ilgili aşağıdakilerden hangisi doğrudur?","dogru":"İşveren tarafından çalışana sağlanan kişisel koruyucu donanımı doğru kullanmak çalışanın sorumluluğudur.","yanlis1":"İşveren, iş kazası ve meslek hastalığı durumunda hiçbir sorumluluğu yoktur. ","yanlis2":"Çalışanlar, işveren tarafından verilen eğitim ve talimatlar doğrultusunda hareket etmek zorunda değildir.","yanlis3":"Sağlık ve güvenlik yönünden ciddi ve yakın bir tehlikeli durumu işverene bildirmek gerekli değildir."},{"soru":"Meslek hastalıklarına ilişkin aşağıdaki bilgilerden hangisi doğrudur?","dogru":"Çalışma ortamındaki tehlikelerin ortadan kaldırılması meslek hastalığının oluşmasını engeller.","yanlis1":"Tozlu veya gürültülü ortamlarda uzun süreli çalışmak meslek hastalığına sebep olmaz.","yanlis2":"Meslek hastalıkları bir anda oluşur ve basit ilaçlarla hemen tedavi edilir.","yanlis3":"Kişisel koruyucu donanım kullanımı meslek hastalıklarını önlemede etkisizdir."},{"soru":"Aşağıdaki işyerlerinden hangisi psikososyal risk etmeni açısından daha tehlikelidir?","dogru":"Uzun süre stres ve baskı altında çalışılan işyerleri.","yanlis1":"Yüksek gürültü seviyesinde çalışılan işyerleri.","yanlis2":"Tozlu ve kirli ortamları bulunan işyerleri.","yanlis3":"Yoğun kimyasal kullanılan işyerleri."},{"soru":"İlkyardımın amacı aşağıdakilerden hangisidir?","dogru":"Hasta veya yaralının durumunun kötüleşmesini önlemek ve hayati tehlikeyi azaltmak.","yanlis1":"Ambulans gelene kadar hastayı bir yerden bir yere taşımak.","yanlis2":"Kazazedeye ilaç vermek ve tedavi etmek.","yanlis3":"Kazaya uğrayan çalışanı görmezden gelip olay yerinden uzaklaşmak."}]};
    let sinavicerigi = [];
calisanliste.forEach((calisan, i) => {
const usttablo = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
        new TableRow({ height: { value: 500, rule: HeightRule.EXACT }, children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TEMEL İSG EĞİTİMİ DEĞERLENDİRME SORULARI", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], columnSpan: 2, verticalAlign: VerticalAlign.CENTER })] }),
        new TableRow({ height: { value: 400, rule: HeightRule.EXACT }, children: [
            new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: "Ad Soyad", font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER }),
            new TableCell({ width: { size: 88, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: calisan.a || "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER })
        ]})
    ]
});
    const genelsorular = sinavsorusec(sinavjson.genelsoru, 7);
    const tekniksorular = sinavsorusec(sinavjson.tekniksoru, 7);

const sinavbirsorular = genelsorular.flatMap((soruObj, index) => {
    const yanlislar = [soruObj.yanlis1, soruObj.yanlis2, soruObj.yanlis3];
    const dogruCevapIndex = index % 4;
    const siraliSecenekler = [];
    for (let i = 0; i < 4; i++) siraliSecenekler.push(i === dogruCevapIndex ? soruObj.dogru : yanlislar.shift());
    const sikHarfleri = ["a-)", "b-)", "c-)", "d-)"];
    const secenekParagraflari = siraliSecenekler.map((secenek, i) =>
        new Paragraph({ children: [new TextRun({ text: `${sikHarfleri[i]} ${secenek}`, font: "Calibri", size: 22 })], spacing: { after: i === 3 ? 125 : 50 }, alignment: AlignmentType.JUSTIFIED })
    );
    return [
        new Paragraph({ children: [new TextRun({ text: `${index + 1}-)`, bold: true, font: "Calibri", size: 22 }), new TextRun({ text: ` ${soruObj.soru}`, font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 125 } }),
        ...secenekParagraflari
    ];
});
const sinavikisorular = tekniksorular.flatMap((soruObj, index) => {
    const yanlislar = [soruObj.yanlis1, soruObj.yanlis2, soruObj.yanlis3];
    const dogruCevapIndex = index % 4;
    const siraliSecenekler = [];
    for (let i = 0; i < 4; i++) siraliSecenekler.push(i === dogruCevapIndex ? soruObj.dogru : yanlislar.shift());
    return [
        new Paragraph({ children: [new TextRun({ text: `${index + 1}-)`, bold: true, font: "Calibri", size: 22 }), new TextRun({ text: ` ${soruObj.soru}`, font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 125 } }),
        ...siraliSecenekler.map((secenek, i) =>
            new Paragraph({ children: [new TextRun({ text: ["a-)", "b-)", "c-)", "d-)"][i] + ` ${secenek}`, font: "Calibri", size: 22 })], spacing: { after: i === 3 ? 125 : 50 }, alignment: AlignmentType.JUSTIFIED })
        )
    ];
});
    const kisininSinavi = [
        usttablo,
        new Paragraph({}),
        ...sinavbirsorular,
        new Paragraph({}),
        new Paragraph({ children: [new TextRun({ text: `Başarılı  ☐   Başarısız  ☐`, font: "Calibri", size: 26 })], alignment: AlignmentType.CENTER, spacing: { after: 100, before: 100 } }),
        new Paragraph({}),
        new Paragraph({}),
        new Paragraph({}),
        usttablo,
        new Paragraph({}),
        ...sinavikisorular,
        new Paragraph({}),
        new Paragraph({ children: [new TextRun({ text: `Başarılı  ☐   Başarısız  ☐`, font: "Calibri", size: 26 })], alignment: AlignmentType.CENTER, spacing: { after: 100, before: 100 } }),
        new Paragraph({}),
        new Paragraph({}),
        new Paragraph({}),
    ];
    sinavicerigi.push(...kisininSinavi);
});
    const doc = new Document({
    sections: [{
        properties: {
            page: { margin: { top: 850, right: 850, bottom: 850, left: 850 } }
        },
        children: sinavicerigi,
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Sınav.docx");
}
function sinavsorusec(soruDizisi, adet)
{
  let kopya = [...soruDizisi];
    for (let i = kopya.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
    }
  return kopya.slice(0, adet);
}

async function digeregitimsertifikakontrol()
{
    $('#loading').show();
    $.when(digeregitimsertifikayaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

async function digeregitimsertifikayaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let digeregitimveri = store.get('digeregitimveri');
    digeregitimveri = JSON.parse(digeregitimveri || '{}');
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri || '{}');
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e)
        {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ ad: "", un: "" }];
    }
    let isyeriismi = isyeri.fi;
    let isverenvekili = isyeri.is;
    let tarih = digeregitimveri.tarih || "......./......./20.....";
    let egitimturint = parseInt(digeregitimveri.egitimtur) || 1;
    const egitimtur = new Map([[0,"Lütfen Seçiniz"],[1,"İş Ekipmanı Eğitimi"],[2,"Yüksekte Çalışma Eğitimi"],[3,"Kimyasal Eğitimi"],[4,"İş Kazası Eğitimi"],[5,"KKD Eğitimi"]]);
    let egitimturdosya = egitimtur.get(parseInt(egitimturint));
    let egitimtsaat = digeregitimveri.saat || "2 Saat";
    let egitimyeri = digeregitimveri.egitimyeri || "Örgün";
    let egitimicerik = {};
    let bosluk = 0;
    if (egitimturint === 1)
    { bosluk = 50; egitimicerik = { "baslik": "İŞ EKİPMANLARIYLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "İŞ EKİPMANLARI İLE GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği” 10.ve 11.maddeleri çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş ekipmanı kumanda ve acil durdurma sistemleri", "İş ekipmanı bakım onarım işlerinde güvenlik", "İş ekipmanlarının ergonomik kullanımı", "İş ekipmanı kaynaklı iş kazaları ve meslek hastalıkları", "İş sağlığı ve güvenliği talimatı ve kullanım kılavuzları", "İş ekipmanlarının koruyucu donanımları"] }; }
    if (egitimturint === 2)
    { bosluk = 50;egitimicerik = { "baslik": "YÜKSEKTE ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "YÜKSEKTE GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Yapı İşlerinde İş Sağlığı ve Güvenliği Yönetmeliği Ek-4 Madde-2/g” çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Yükseklik ile ilgili tanımlar, yüksekte çalışmanın kuralları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Kişisel koruyucu donanımlar ve doğru kullanım şekli", "Yüksekte çalışma ekipmanlarının güvenli kullanımı", "Yüksek düşmeye neden olan faktörler", "Yatay ve dikey yaşam hatlarının kullanımı"] }; }
    if (egitimturint === 3)
    { bosluk = 50;egitimicerik = { "baslik": "KİMYASALLARLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "KİMYASALLARLA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kimyasal Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik” 9. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Patlayıcı ortam ve patlamadan korunma tedbirleri", "Kimyasal risk işaretleri ve güvenlik tedbirleri", "Kimyasalların uygun şekilde depolanması", "Malzeme güvenlik bilgi formları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri"] }; }
    if (egitimturint === 4)
    { bosluk = 43, egitimicerik = { "baslik": "İŞ KAZASI SONRASI İŞE DÖNÜŞ EĞİTİM SERTİFİKASI", "katilim": "İŞ KAZASI SONRASI İŞE DÖNÜŞ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik” 6. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş kazasının sebepleri", "İş kazasından korunma yöntemleri", "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "Güvenli çalışma yöntemleri", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Düzeltici ve önleyici faaliyetler hakkında bilgilendirme"] } };
    if (egitimturint === 5)
    { bosluk = 50, egitimicerik = { "baslik": "KİŞİSEL KORUYUCU DONANIM EĞİTİMİ SERTİFİKASI", "katilim": "KİŞİSEL KORUYUCU DONANIM - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik” 5. madde çerçevesinde aşağıda yer alan konularda uygulamalı eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş sağlığı ve güvenliği kültürü", "Toplu ve kişisel olarak korunma yöntemleri", "Kişisel koruyucu donanım tip ve çeşitleri", "Kişisel koruyucu donanım hijyeni ve temizliği", "Kişisel koruyucu donanım kullanımı önemi"] } };
    const iconBase64 = 'data:image/png;base64,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AADGPwAIACACAGD8A4AAACIAAMY/AAgAIAIAYPwDgAAAIgAAxj8ACAAgAgAY/8Y/AAgAIAIAGP8AgAAAIgCA8Q8ACAAgAgAY/wAgAAAiAIDxDwACACACABj/ACAAgAgAgPEPAAIAiAAAGP8AIACACABg/AMAAgCIAADGPwAgAIAIAGD8AwACAIgAAMY/AAgAgAgAYPwDgAAAiAAAxj8ACACACABg/AOAAAAigAgAGP8AgAAAIgCA8Q8ACAAgAgAY/wCAAAAiAIDxDwAIACACABj/ACAAACIAgPEPAAIAIAIAGP8AIAAAIgCA8Q8AAgAgAgDGPwAgAAAiAGD8AwACAIgAAMY/ACAAgAgAYPwDAAIAiAAAxj8ACACOAEQAAOMfAAQAQAQAMP4BQAAARADA+AcABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAABFABACMfwBAAAARAMD4BwAEABABAIx/ABAAABEAMP4BAAEAEAEA4x8AEAAAEQAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEARAAA4x8ABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARADA+AcABABABACMfwBAAABEADD+AQABABABRAAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEAEAEA4x8AEAAAEQCMf+MfABAAABEAjH8AAAEAEAHA+AcABAAAEQCMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARAAw/gEABABABADjHwBAAABEADD+AQABAEAEAOMfABAAAEQAMP4BAAEAEAFEADD+AQABABABAOMfABAAABEAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABwPgHAAQAABEAjH8AQAAAEAHA+AcABABABADjHwBAAABEADD+AQAEAEAEAOMfAEAAAEQAMP4BAAQAQAQA4x8AEAAARAAw/gEAAQBABADjHwAQAABEAIx/AAABAEAEwPgHABAAAEQAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABMP4BAAQAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAEAEEAEw/gEABABABADjHwAQAABEADD+AQABAEAEwPgHABAAAEQAjH8AAAEAQATA+AcAEAAARACMfwAAAQBABMD4BwAQAABEAIx/AAABAEAEwPgHABAAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAAARAOMfAEAAABABMP4BAAQAABEA4x8AQAAAOHcEMBiNfwCAsG46AoCiaNv2l/R6XZZllf5y6kSMfwAAAQAgdggQAYYp38Xx5zT+/+ooAAA+zkcAAP5PGpEP0tsDJzGo8X83/b4dOQoAAAEAYNMIcJje7nXjkv7KD2/8Kv1+eYgjAIAAAHDuCJB/ouwbAvrrsFj/5F+kAQA4gx1HAHC63d3dSXp7kV57TqM3POwPAGBDHgII8AndNwT8rSzLn9Nf3kmvW07l2uS7Mf6Yxv/fHQUAwGZ8BADgjNLofFb4SMB1en/+Pu8PAHA+PgIAcA67u7tP0ttjJ3EllsX6lv+5owAAOD93AACcQxqjOQDcLtwNcNnyT/1vG/8AANtzBwDAlnZ3dx8V67sBJk7jwuSwsm/4AwAIAAB9iwB5/B+k18xpbGXVDf9DRwEAIAAA9DkEVF0I8JWBmw//5+n1LI3/leMAABAAAIYSAupi/bGA2mkY/gAAAgDAOELA/cJHAwx/AAABAGAUIaAq1ncE5I8GjPlhgctu+B8a/gAAAgBA5BAw6SLAw/Sajugf/TC9XnqqPwCAAAAwxhiQA8D9LghUAf8R81f55Z/2H/lpPwCAAABArBgwT6/X3ehf+p0FABAAAPjtGFB1IeCbYv0tAn1+ZsDyg9E/95N+AAABAIDzB4F8d8C0CwInv74Oedzn2/qPu/eFn/IDAAgAAFx+FKi6GPBl9+vJBcWBefd+/MFfL419AAABAID+BYKNYoCn8wMAAAAAAARwwxEAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAMB/2bEDGQAAAIBB/tb3+AojAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAgAAAAAAAFhJAgAEApKo6nvcfVk8AAAAASUVORK5CYII=';
const docDefinition = {
  images: {
    tickIcon: iconBase64,
  },
  styles: {
    ustbaslik: { fontSize: 14, bold: true, alignment: 'center' },
    normalsatir: { fontSize: 11, alignment: 'justify' }
  },
  pageOrientation: 'landscape',

  content: calisanliste.map((calisan, index) => {
    const content = [
      { text: egitimicerik.baslik, style: 'ustbaslik', margin: [0, 50, 0, 10] },
      { text: 'İşyeri Unvanı: ' + isyeriismi, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Katılımcı Adı Soyadı: ' + calisan.ad, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Katılımcının Görev Unvanı: ' + calisan.un, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Tarih: ' + tarih, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Eğitim Süresi: ' + egitimtsaat, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: 'Eğitim Şekli: ' + egitimyeri, style: 'normalsatir', margin: [80, 0, 0, 5] },
      { text: egitimicerik.paragraf, style: 'normalsatir', margin: [46, 0, 50, 5] },

      ...egitimicerik.maddeler.map(madde => ({
        columns: [
          {
            image: 'tickIcon',
            width: 11,
            height: 14,
            margin: [80, 0, 0, 0]
          },
          {
            text: madde,
            style: 'normalsatir',
            margin: [85, 0, 50, 0]
          }
        ],
        columnGap: 5,
        margin: [0, 2, 0, 2]
      })),

      { text: '', margin: [0, bosluk] },
      genelucluimzatablo(uzmanad, isverenvekili, hekimad, uzmanno, hekimno)
    ];

    if (index < calisanliste.length - 1) {
      content.push({ text: '', pageBreak: 'after' });
    }

    return content;
  }).flat()
};
    sertifikaarkaplan(docDefinition);
    const pdfcikti = pdfMake.createPdf(docDefinition);
    pdfcikti.getBlob((blob) => {saveAs(blob, egitimturdosya + '.pdf');});
}
function genelucluimzatablo(a,b,c,d,e){return{table:{widths:[47,207,207,207,47],body:[["",{text:a,alignment:"center",fontSize:11,bold:!0},{text:b,alignment:"center",fontSize:11,bold:!0},{text:c,alignment:"center",fontSize:11,bold:!0},""],["",{text:"İş Güvenliği Uzmanı",alignment:"center",fontSize:11},{text:"İşveren Vekili",alignment:"center",fontSize:11},{text:"İşyeri Hekimi",alignment:"center",fontSize:11},""],["",{text:"Belge No: "+d,alignment:"center",fontSize:11},"",{text:"Belge No: "+e,alignment:"center",fontSize:11},""]]},layout:"noBorders"}}


async function digeregitimkatilimkontrol()
{
    $('#loading').show();
    $.when(digerkatılımlistesiyaz())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

async function digerkatılımlistesiyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let digeregitimveri = store.get('digeregitimveri');
    digeregitimveri = JSON.parse(digeregitimveri || '{}');
    let bossatir = parseInt(digeregitimveri.bossatir || "0");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri || '{}');
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanlistedata = store.get('calisansecimjsonx');
    let calisanliste = [];
    if (calisanlistedata)
    {
        try
        {
            calisanliste = JSON.parse(calisanlistedata);
        }
        catch (e) {
            calisanliste = [];
        }
    }
    if (!Array.isArray(calisanliste) || calisanliste.length === 0) {
        calisanliste = Array.from({ length: 13 }, () => ({ ad: "", un: "" }));
    }
    else if (bossatir > 0)
    {
        calisanliste = calisanliste.concat(Array.from({ length: bossatir }, () => ({ ad: "", un: "" })));
    }
    let isyeriismi = isyeri.fi;
    let egitimtsaat = digeregitimveri.saat || "2 Saat";
    let egitimyeri = digeregitimveri.egitimyeri || "Örgün";
    let tarih = digeregitimveri.tarih || "......./......./20.....";
    const katilimlistesi = { pageMargins: [25, 25, 25, 25], content: [] };

    let egitimturint = parseInt(digeregitimveri.egitimtur) || 1;
    if (egitimturint === 1)
    {egitimicerik = { "baslik": "İŞ EKİPMANLARIYLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "İŞ EKİPMANLARIYLA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği” 10.ve 11.maddeleri çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş ekipmanı kumanda ve acil durdurma sistemleri", "İş ekipmanı bakım onarım işlerinde güvenlik", "İş ekipmanlarının ergonomik kullanımı", "İş ekipmanı kaynaklı iş kazaları ve meslek hastalıkları", "İş sağlığı ve güvenliği talimatı ve kullanım kılavuzları", "İş ekipmanlarının koruyucu donanımları"] }; }
    if (egitimturint === 2)
    {egitimicerik = { "baslik": "YÜKSEKTE ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "YÜKSEKTE GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Yapı İşlerinde İş Sağlığı ve Güvenliği Yönetmeliği Ek-4 Madde-2/g” çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Yükseklik ile ilgili tanımlar, yüksekte çalışmanın kuralları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Kişisel koruyucu donanımlar ve doğru kullanım şekli", "Yüksekte çalışma ekipmanlarının güvenli kullanımı", "Yüksek düşmeye neden olan faktörler", "Yatay ve dikey yaşam hatlarının kullanımı"] }; }
    if (egitimturint === 3)
    {;egitimicerik = { "baslik": "KİMYASALLARLA GÜVENLİ ÇALIŞMA EĞİTİMİ KATILIM SERTİFİKASI", "katilim": "KİMYASALLARLA GÜVENLİ ÇALIŞMA - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kimyasal Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik” 9. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["Patlayıcı ortam ve patlamadan korunma tedbirleri", "Kimyasal risk işaretleri ve güvenlik tedbirleri", "Kimyasalların uygun şekilde depolanması", "Malzeme güvenlik bilgi formları", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri"] }; }
    if (egitimturint === 4)
    {egitimicerik = { "baslik": "İŞ KAZASI SONRASI İŞE DÖNÜŞ EĞİTİM SERTİFİKASI", "katilim": "İŞ KAZASI SONRASI İŞE DÖNÜŞ - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Çalışanların İş Sağlığı ve Güvenliği Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik” 6. madde çerçevesinde aşağıda yer alan konulardaki eğitim programına başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş kazasının sebepleri", "İş kazasından korunma yöntemleri", "İş kazası ve meslek hastalığından doğan hukuki sonuçlar", "Güvenli çalışma yöntemleri", "Toplu koruma yöntemleri ve kişisel korunma yöntemleri", "Düzeltici ve önleyici faaliyetler hakkında bilgilendirme"] } };
    if (egitimturint === 5)
    {egitimicerik = { "baslik": "KİŞİSEL KORUYUCU DONANIM EĞİTİMİ SERTİFİKASI", "katilim": "KİŞİSEL KORUYUCU DONANIM - EĞİTİM KATILIM TUTANAĞI", "paragraf": "\u200B\t\t\tYukarıda adı soyadı yazılı çalışan, “Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik” 5. madde çerçevesinde aşağıda yer alan konularda uygulamalı eğitim programını başarıyla tamamlayarak bu eğitim belgesini almaya hak kazanmıştır.", "maddeler": ["İş sağlığı ve güvenliği kültürü", "Toplu ve kişisel olarak korunma yöntemleri", "Kişisel koruyucu donanım tip ve çeşitleri", "Kişisel koruyucu donanım hijyeni ve temizliği", "Kişisel koruyucu donanım kullanımı önemi"] } };
    let konu = egitimicerik.maddeler.join(', ');
    function createParticipantTable(startIndex, endIndex)
    {
        let tableBody = [];
        tableBody.push(...digerkatilimustbilgi(isyeriismi, tarih, egitimyeri, egitimtsaat, konu, egitimicerik.katilim));
        for (let i = startIndex; i < endIndex; i++) {
            const calisan = calisanliste[i];
            tableBody.push([
                { text: (i + 1).toString(), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.ad || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.un || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: '' }
            ]);
        }
        tableBody.push(
            [
                { text: uzmanad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: hekimad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' },
            ],
            [
                { text: 'İş Güvenliği Uzmanı - Belge No: ' + uzmanno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: 'İşyeri Hekimi - Belge No: ' + hekimno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' },
            ],
            [
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' },
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' },
            ]
        );
        return {
            table: {
                widths: [25, "*", "auto", 100],
                body: tableBody
            },
        };
    }
    const chunkSize = 13;
    for (let i = 0; i < calisanliste.length; i += chunkSize)
    {
        const endIndex = Math.min(i + chunkSize, calisanliste.length);
        katilimlistesi.content.push(createParticipantTable(i, endIndex));
        if (endIndex < calisanliste.length)
        {
        katilimlistesi.content.push({ text: '', pageBreak: 'after' });
        }
    }
    pdfMake.createPdf(katilimlistesi).getBlob(function (blob) { saveAs(blob, 'Katılım Listesi.pdf');});
}
function digerkatilimustbilgi(i, t, e, s, k, bas) {
    return [
        [{ text: bas, colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: `İşyeri Unvanı: ${i}`, colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2] }, '', '', ''],
        [{ colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2], text: [{ text: `Eğitim Tarihi: ${t}\t\t\t\tEğitim Şekli: ${e}\t\t\t\tSüresi: ${s}` }] }, '', '', ''],
        [{ text: 'EĞİTİM KONULARI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: k, colSpan: 4, alignment: 'justify', fontSize: 10, margin: [0, 5] }, '', '', ''],
        [{ text: 'Sıra', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Ad Soyad', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Unvan', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'İmza', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }]
    ];
}



async function kkdzimmettutanakkontrol()
{
    $('#loading').show();
    $.when(kkdzimmettutanakcikti())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}

async function kkdzimmettutanakcikti() {
    let sorumlulukbeyani = "\t6331 sayılı İş Sağlığı ve Güvenliği Kanunu’nun 19. maddesinin 2. fıkrasının (b) bendi uyarınca, “Kendilerine sağlanan kişisel koruyucu donanımı doğru kullanmak ve korumak” yükümlülüğümü, işverenin bu konudaki talimatları ve 4857 sayılı İş Kanunu’nun 25. maddesinin 2. fıkrasında belirtilen haklı fesih nedenleri kapsamında işlem yapılabileceği konusunda bilgilendirildim. Aşağıda listelenen kişisel koruyucu donanımları işveren vekilinden eksiksiz olarak teslim aldım. Bu donanımların doğru ve güvenli kullanımı konusunda gerekli eğitimi aldım ve yeterli bilgiye sahip olduğumu beyan ederim. Bu donanımları iş sağlığı ve güvenliği kurallarına uygun şekilde düzenli olarak kullanacağımı, kullanılmayacak duruma geldiklerinde durumu derhal işveren vekiline bildirerek yenilerini temin etmek üzere başvuracağım. Ayrıca, tarafıma teslim edilen kişisel koruyucu donanımları kasıtlı olarak kullanmamak, uygunsuz şekilde kullanmak ya da talimatlara aykırı davranmak suretiyle maruz kalabileceğim iş kazası veya meslek hastalığı gibi durumlarda, doğabilecek zarar ve sonuçlardan kişisel sorumluluğumun bulunduğunu kabul ederim.";
    let tarih = "Tarih: " + store.get('kkdzimmettarih');
    let isyeri = JSON.parse(store.get('xjsonfirma'));
    let isyeriismi = isyeri.fi;
    let isyeriadresi = isyeri.ad;
    let isveren = isyeri.is;
    let kkdzimmetjson = store.get('kkdzimmetsonliste');
    let calisanliste = JSON.parse(store.get('calisansecimjsonx') || "[]");

    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = [{ a: ".................", u: "................." }];
    }
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, VerticalAlign, BorderStyle, Header, Footer } = window.docx;
    const header = new Header({
        children: [
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                borders: { top: { style: "single", size: 1, color: "000000" }, bottom: { style: "single", size: 1, color: "000000" }, left: { style: "single", size: 1, color: "000000" }, right: { style: "single", size: 1, color: "000000" } },
                                children: [new Paragraph({ children: [new TextRun({ text: isyeriismi, font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })]
                            })
                        ]
                    })
                ]
            })
        ]
    });
    let footer = undefined;
    if (isyeriadresi && isyeriadresi.trim() !== "") {
        footer = new Footer({
            children: [
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: "single", size: 1, color: "000000" }, bottom: { style: "single", size: 1, color: "000000" }, left: { style: "single", size: 1, color: "000000" }, right: { style: "single", size: 1, color: "000000" } },
                                    children: [new Paragraph({ children: [new TextRun({ text: isyeriadresi, font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })]
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }
    const sections = [];

    calisanliste.forEach((calisan, index) => {
        const tarihparagraf = new Paragraph({
            children: [new TextRun({ text: tarih, font: { name: "Calibri" }, size: 22 })],
            alignment: AlignmentType.RIGHT
        });

        const baslik = new Paragraph({
            children: [new TextRun({ text: "KİŞİSEL KORUYUCU DONANIM ZİMMET TUTANAĞI", bold: true, font: { name: "Calibri" }, size: 22 })],
            alignment: AlignmentType.CENTER
        });

        const sorparagraf = new Paragraph({
            children: [new TextRun({ text: sorumlulukbeyani, font: { name: "Calibri" }, size: 22 })],
            alignment: AlignmentType.JUSTIFIED
        });
        const kkdzimmettablo = [];

        kkdzimmettablo.push(new TableRow({
            children: [
                new TableCell({
                    columnSpan: 4,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Kişisel Koruyucu Donanım Tablosu", bold: true, font: { name: "Calibri" }, size: 22 })]
                    })]
                })
            ]
        }));

        kkdzimmettablo.push(new TableRow({
            children: [
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Donanım Türü", bold: true, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 40, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Standart", bold: true, font: { name: "Calibri" }, size: 22 })] })] }),
                new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Adet", bold: true, font: { name: "Calibri" }, size: 22 })] })] })
            ]
        }));

        kkdzimmetjson.forEach((item, index) => {
            kkdzimmettablo.push(new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(index + 1), font: { name: "Calibri" }, size: 22 })] })] }),
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: item.k, font: { name: "Calibri" }, size: 22 })] })] }),
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: item.s, font: { name: "Calibri" }, size: 22 })] })] }),
                    new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.a, font: { name: "Calibri" }, size: 22 })] })] })
                ]
            }));
        });

        const kkdzimmettabloicerik = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 70, bottom: 70, left: 50, right: 50 },
            rows: kkdzimmettablo
        });
        const imzatablo = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: isveren, bold: true, font: "Calibri", size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisan.a, bold: true, font: "Calibri", size: 22 })] })] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İşveren Vekili", font: "Calibri", size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisan.u, font: "Calibri", size: 22 })] })] })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })] })] }),
                        new TableCell({ verticalAlign: VerticalAlign.CENTER, width: { size: 50, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })] })] })
                    ]
                })
            ]
        });
        sections.push({
            properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
            headers: { default: header },
            ...(footer ? { footers: { default: footer } } : {}),
            children: [tarihparagraf, new Paragraph(''), baslik, new Paragraph(''), sorparagraf, new Paragraph(''), kkdzimmettabloicerik, new Paragraph(''), imzatablo]
        });
    });
    const doc = new Document({ sections });
    Packer.toBlob(doc).then(blob =>
    {
        saveAs(blob, "KKD Zimmet.docx");
    });
}

async function talimatyazdirword(button)
{
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, Header, Footer, BorderStyle } = window.docx;
    let isyerijson = store.get('xjsonfirma');
    if (!isyerijson)
    {
        return alertify.error("İşyeri bilgisi alınamadı.");
    }
    try
    {
        isyerijson = JSON.parse(isyerijson);
    }
    catch
    {
        return alertify.error("İşyeri JSON verisi geçersiz.");
    }
    const isveren = isyerijson.is || "";
    let adsoyad = "";
    let unvan = "";
    if (button.id === "bosyazdir")
    { 
        adsoyad = "......................"; 
        unvan = "Çalışan";
    }
    else
    {
        adsoyad = (button.getAttribute("data-ad") || "").trim();
        unvan = (button.getAttribute("data-un") || "").trim(); 
    }
    const uzmanad = store.get("uzmanad") || "";
    const talimatlarHam = [$('#HiddenField2').val(), $('#HiddenField3').val(), $('#HiddenField4').val(), $('#HiddenField5').val(), $('#HiddenField6').val()];
    const sections = [];
    const altbilgi = new Table({
        rows:
        [
                new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: uzmanad, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 31, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: isveren, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 31, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: adsoyad, font: "Calibri", size: 22, bold: true })], alignment: AlignmentType.CENTER })], verticalAlign: "center", width: { size: 38, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } })] }),
                new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İş Güvenliği Uzmanı", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İşveren Vekili", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: unvan, font: "Calibri", size: 22})], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } })] }),
                new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22 })], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "İmza", font: "Calibri", size: 22})], alignment: AlignmentType.CENTER })], verticalAlign: "center", borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } } })] }),
        ],
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER
    });
    for (let i = 0; i < talimatlarHam.length; i++)
    {
        let t = talimatlarHam[i];
        if (!t || t === "Yok") continue;
        let icerik;
        try
        {
            icerik = JSON.parse(t);
        }
        catch
        {
            continue;
        }
        const baslik = Object.keys(icerik)[0];
        const paragraflar = (icerik[baslik] || []).map(p => p.i);
        const headerTable=new Table({rows:[new TableRow({children:[new TableCell({children:[new Paragraph({children:[new TextRun({text:baslik,bold:true,font:"Calibri",size:24})],alignment:AlignmentType.CENTER})],verticalAlign:"center"})]})],width:{size:100,type:WidthType.PERCENTAGE},alignment:AlignmentType.CENTER});
        sections.push
        ({
            properties:{page:{margin:{top:1134,bottom:1417,left:851,right:851,header:567,footer:1134}}},
            headers: { default: new Header({ children: [headerTable] })},
            footers: { default: new Footer({ children: [altbilgi] }) },
            children:[...paragraflar.map(text=>new Paragraph({children:[new TextRun({text,font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}})),]
        });
    }
    if (sections.length === 0) return alertify.error("Hiçbir talimat içeriği alınamadı.");
    const doc = new Document({ sections });
    const blob = await Packer.toBlob(doc);
    if (button.id === "bosyazdir")
    { 
        saveAs(blob, `Boş İSG Talimat.docx`);
    }
    else
    {
        saveAs(blob, `${adsoyad} İSG Talimat.docx`);
    }
}

async function acildurumgirisyazdocx()
{
    let acildurumkonusecim = store.get("acildurumkonusecim");
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    var tehlikesinifimap = { 1: "Az Tehlikeli", 2: "Tehlikeli", 3: "Çok Tehlikeli"};
    let tehlikesinifi = tehlikesinifimap[isyeri.ts];
    let tehlikeno = isyeri.ts;
    let acildurumtarih = store.get("acildurumtarih");
    let acildurumyil = acildurumtarih.split('.')[2];
    let gecerlitarih = acildurumgecerlilik(acildurumtarih, tehlikeno);
    let isyeriismi = isyeri.fi;
    let isyeriadresi = isyeri.ad;
    let isyerisehir = isyeri.sh;
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let kapaksecim = parseInt($('#kapaksecim').val());
    let isyeribaslik = isyeribaslikayar(kapaksecim, isyeriismi);
    let ustbaslik = "";
    let altbaslik = "";
    if (isyeribaslik)
    {
        ustbaslik = isyeribaslik.ustbaslik.toLocaleUpperCase("tr-TR");
        altbaslik = isyeribaslik.altbaslik.toLocaleLowerCase('tr-TR').split(' ').map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1)).join(' ');
    }
    const { Document, Packer, TextRun, Paragraph, BorderStyle, PageBreak, AlignmentType } = docx; 
    const girisparagraflar =
        [
            new Paragraph({ children: [new TextRun({ text: "ACİL DURUM PLANI", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "center" }),
            new Paragraph({ children: [new TextRun({ text: "İşyeri Unvanı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: isyeriismi, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "İşyeri Adresi", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: isyeriadresi, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "İşveren Vekili Adı Soyadı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: isveren, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Acil Durum Plan Tarihi", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: acildurumtarih, bold: false, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Acil Durum Planı Son Geçerlilik Tarihi", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: gecerlitarih, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Acil Eylem Planı Revizyon Tarihi – Revizyon No", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "01.10.2024-3", size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Hazırlayan Adı Soyadı - Unvanı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: uzmanad + " - İş Güvenliği Uzmanı / " + hekimad + " İşyeri Hekimi", bold: false, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Tehlike Sınıfı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: tehlikesinifi, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "Çalışan Sayısı", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: $("#calisansayi").val(), size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "İşyeri İletişim Bilgileri", bold: true, size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: $("#isyeriiletisim").val(), size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: "left" }),
            ...Array(3).fill().map(() => new Paragraph({ text: "" })),
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ children: [new TextRun({ text: "\tTANIMLAR", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil durum:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerinin tamamında veya bir kısmında meydana gelebilecek veya işyerini dışarıdan etkileyebilecek yangın, patlama, tehlikeli kimyasal maddelerden kaynaklanan yayılım, zehirlenme, salgın hastalık, radyoaktif sızıntı, sabotaj ve doğal afet gibi ivedilikle müdahale gerektiren olayları ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil durum planı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerlerinde meydana gelebilecek acil durumlarda yapılacak iş ve işlemler ile uygulamaya yönelik eylemlerin yer aldığı planı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tToplanma yeri:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumların olumsuz sonuçlarından çalışanların etkilenmeyeceği mesafede veya korunakta belirlenmiş güvenli yeri ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Çağrı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumlarda, etkilenen veya etkilenenleri gören kişi ya da acil durum algılayıcı cihazlar tarafından, telefon, telsiz, kısa mesaj, otomatik mesaj, sosyal medya, internet ve diğer iletişim araçları ile acil çağrı merkezlerine yapılan başvuruyu ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Çağrı Merkezi (112):", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Kullanıcıların veya acil durum algılayıcı cihazların acil yardım talebinde bulunmak amacıyla acil yardım çağrı hizmeti numaralarına doğru yapacakları çağrılara cevap vermekle yetkili kurum veya kuruluşu ifade eder. Bu kapsamda, yasal düzenlemeye göre ülkemizde 112 acil çağrı merkezini ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Çıkış:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Tehlike anında kapalı mekândaki insanların süratle ve güvenli bir şekilde tahliye edilmesine imkân verecek yolu ve dışarıya doğru açılan kapıyı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAFAD:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Afet ve Acil Durum Yönetimi Başkanlığını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tAcil Durum Risk Seviyesi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumun yol açtığı ve acil duruma bağlı nedenlerle oluşabilecek can kayıpları, yaralanma ve sakat kalmalar, yapı ve altyapı hasarları gibi fiziksel hasarlarla ekonomik, sosyal ve psikolojik kayıpların tümünü ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
            new Paragraph({ children: [new TextRun({ text: "\tBoğulma:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Sel, deniz, göl, kuyu, sıvı birikintisi oluşabilecek çukurlar vb. alanlarda nefes borusuna sıvı dolması, suda nefessiz kalma, tank vb. kapalı alanlarda gazla zehirlenme, yangın anında oluşan karbon monoksit nedeniyle vücuttaki dokulara yeterli oksijen gitmemesi sonucu dokularda bozulma meydana gelmesi durumunu ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),
        ];
        if (acildurumkonusecim.yangin === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tYangın:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Maddenin yeterli derecede ısı ve oksijen (hava) ile birleşmesi sonucunda yanarak kimyasal şekil değişliğine uğraması olayını ifade eder. Yangının oluşabilmesi için yanıcı madde, yüksek ısı ve oksijene ihtiyaç vardır. Kontrolsüz veya kontrol edilemeyen şekilde açığa çıkan, yakıcı etkisiyle madde ve eşyaları kullanılmaz hâle getiren, boğucu etkisiyle canlıların yaşamına son veren tehlikedir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.deprem === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tDeprem:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Tektonik kuvvetlerin veya volkan faaliyetlerinin etkisiyle yer kabuğunun kırılması sonucunda ortaya çıkan enerjinin sismik dalgalar hâlinde yayılarak geçtikleri ortamları ve yeryüzünü kuvvetle sarsması olayını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.sel === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSel:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Suların bulunduğu yerde yükselerek veya başka bir yerden gelerek, genellikle kuru olan yüzeyleri kaplaması olayı.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.sabotaj === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSabotaj:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyeri veya çalışanlarını hedef alan ve idari yapının tamamen veya geçici bir süre için faaliyet dışı kalmasını sağlamak amacıyla tahribine yönelik saldırgan bir yıkıcı faaliyet şeklini ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tGasp:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Başkasının zilyetliğindeki taşınabilir bir malı, zilyedinin rızası olmaksızın, faydalanmak amacıyla, cebir veya tehdit kullanarak bulunduğu yerden almayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKaçırılma:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Kişiyi hürriyetinden yoksun bırakmak amacıyla bir kişiyi hukuka aykırı yollarla, iradesi dışında, bir yere götürmek veya bir yerde bulundurmayı, alıkoymayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.elektrik === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tElektrik:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Elektrik tesisatında veya elektrikli ekipmanlardan kaynaklanan hata akımı, yanlış müdahale/temas veya atlama sonucunda insanda oluşturduğu olumsuz etkiyi ifade eder. Alternatif akımda 50 Volt ve üzeri, doğru akımda ise 120 volt üzeri elektrik çarpması tehlikeli olarak kabul edilir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.salgin === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSalgın Hastalık:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Belirli bir alanda, belirli bir grup insan arasında, belirli bir süre boyunca bir biyolojik risk etmeninden kaynaklanan hastalığın bireylerde beklenenden daha fazla görülmesi, anormal miktarda artması durumu ve bulaşmasını ifade eder. Covid-19 bu hastalığa örnek gösterilebilir. Bir hastalığın beklenen görülme sıklığı ve salgın hastalık olup olmadığı Dünya Sağlık Örgütü ve T.C. Sağlık Bakanlığı tarafından belirlenir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBiyolojik Kaynaklı Yayılım/Sızıntı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Biyolojik etkenle doğrudan çalışılan veya biyolojik etkenin kullanıldığı bir işyerinden biyolojik risk etmeninin sızıntısını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.iskaza === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tİş Kazası:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerinde veya işin yürütümü nedeniyle meydana gelen, ölüme sebebiyet veren veya vücut bütünlüğünü ruhen ya da bedenen engelli hâle getiren olayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.gida === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\t Zehirlenme", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Az miktarlarda solunduğunda, ağız yoluyla alındığında, deri yoluyla emildiğinde insan sağlığı üzerinde akut veya kronik hasarlar meydana getiren olayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.yildirim === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tYıldırım Düşmesi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Yeryüzü ile bulutlar arasında meydana gelen elektrik boşalması sonucunda oluşan yıldırımın, işyerine veya bir canlıya isabet etmesini ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.basiclikap === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBasınçlı Kap Patlaması:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Kaynaklı, 0,5 bar’dan daha yüksek iç basınca tabi tutulması amaçlanan bir kabın, içinde bulunan gazın azami basınç seviyesinin üzerine çıkarak aniden, kontrolsüz bir biçimde boşalması ve metal aksamın parçalanarak hızlı bir şekilde etrafa yayılmasıdır.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.kmaruziyet === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKimyasal Maruziyet:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Belirli bir referans sürede çalışanların solunum bölgesindeki havada bulunan kimyasal madde konsantrasyonunun zaman ağırlıklı ortalamasının üst sınırını (STEL) veya çalışma süresinin herhangi bir anında çalışanların solunum bölgesindeki havada bulunan kimyasal madde konsantrasyonunun aşılmaması gereken üst sınırın aşılması sonucu oluşabilecek AKUT zehirlenme", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.ksizinti === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKimyasal Sızıntı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Canlılar üzerinde tahriş edici, yakıcı, felç edici veya öldürücü etkileri olan, deri, solunum veya sindirim sistemi yoluyla bünyeye girebilen gaz, sıvı ya da katı şekildeki toksik kimyasal maddelerin kasten veya kazaen çevreye yayılmasına neden olabilecek her türlü olayı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.patlama === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tPatlayıcı Ortam:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Yanıcı maddelerin gaz, buhar, sis ve tozlarının atmosferik şartlar altında hava ile oluşturduğu ve herhangi bir tutuşturucu kaynakla temasında tümüyle yanabilen karışımı ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.bakimonarim === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBakım Onarım:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyeri iş akışında planlı/periyodik bakım işleri ile beklenmedik bir şekilde oluşan arızların ivedilikle yapılması için gerekli her türlü müdahaleyi ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }
        if (acildurumkonusecim.hayvansokma === 1)
        {
            girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tHayvan Sokması/Isırması:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Çalışma alanında veya çevresinde bulunan arı, akrep, yılan, böcek, köpek gibi hayvanların sokması, ısırması veya saldırması sonucu çalışanlarda meydana gelen zehirlenme, alerjik reaksiyon, yara, enfeksiyon gibi sağlık sorunlarını ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        }        
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tAMAÇ", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tİşyerinde yürütülen çalışma sırasında, olağan dışı olayların sonuçlarından en az kayıp ve zararla kurtulabilmesi için yapılması gereken iş ve işlemlerin, olaylar olmadan önce planlaması ve olay sırasında; uygulanmasını gerektiren tüm faaliyetler zamanında, hızlı ve etkili bir şekilde uygulanmasını amaçlamaktadır.", size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tDAYANAK", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tBu plan, İş sağlığı ve güvenliği kanunu 11,12 ve 30. maddeleri ile 18.06.2013 tarihli “İşyerlerinde Acil Durumlar Hakkında Yönetmelik” ve yine aynı yönetmeliğin 01.10.2021 tarihinde yapılan değişikliklere göre hazırlanmıştır.", size: 22, font: "Calibri" })], spacing: { before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tACİL DURUM EKİPLERİ GÖREV TANIMLARI", bold: true, size: 24, font: "Calibri" })], spacing: { before: 0, after: 100 }, alignment: "left" }));
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSöndürme ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerinde çıkabilecek yangınlara derhal müdahale ederek mümkünse yangını kontrol altına almak, yangının genişlemesine mani olmak ve söndürme faaliyetlerini yürütmek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKurtarma ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " İşyerlerinde acil durum sonrası; çalışanların, ziyaretçilerin ve diğer kişilerin arama ve kurtarma işlerini gerçekleştirmek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKoruma ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durum nedeniyle ortaya çıkması muhtemel panik ve kargaşayı önlemek, acil durum ekipleri arasındaki koordinasyon işlerini gerçekleştirmek, sayım işlerini yürütmek, gerektiğinde ilgili ulusal ve yerel kurumların müdahale ekiplerine bilgi vermek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tİlkyardım ekibi:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Acil durumdan olumsuz etkilenen kişilerin ilk yardım müdahalelerini gerçekleştirmek.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tDestek elemanı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Asli görevinin yanında acil durumlara ilişkin ulusal ve yerel kurum ve kuruluşlarla irtibatı sağlamak, iş sağlığı ve güvenliği ile ilgili önleme, koruma, tahliye, yangınla mücadele, ilk yardım ve benzeri konularda özel olarak görevli olan kişidir.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tSorumluluk alanı:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Ekiplerde yer alan görevli kişilerin (destek elemanlarının) acil duruma ilişkin görevini gerçekleştireceği birim veya bölümü ifade eder.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
        girisparagraflar.push(new Paragraph({ children: [new TextRun({ text: "\tKoordinasyon:", bold: true, font: "Calibri", size: 22 }), new TextRun({ text: " Koordinasyonla görevli olan kişi, koruma ekibinde yer alıp ayrıca ekipler arasında iletişimi ve organizasyonu yapmakla da ayrıca görevlidirler.", font: "Calibri", size: 22 })], alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 } }),);
    const doc = new Document
    ({
        sections:
        [
            {
                properties: { page: { margin: { top: 567, bottom: 567, left: 567, right: 567 }, borders: { pageBorderTop: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorderBottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorderLeft: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorderRight: { style: BorderStyle.SINGLE, size: 8, color: "000000" }, pageBorders: { display: docx.PageBorderDisplay.FIRST_PAGE, offsetFrom: docx.PageBorderOffsetFrom.TEXT, zOrder: docx.PageBorderZOrder.FRONT } } } },
                children:
                [
                    new Paragraph({ children: [new TextRun({ text: ustbaslik, bold: true, size: 36, font: "Tahoma" })], spacing: { before: 350, after: 200 }, alignment: "center" }),
                    new Paragraph({ children: [new TextRun({ text: altbaslik, size: 28, font: "Tahoma" })], spacing: { before: 200, after: 100 }, alignment: "center" }),
                    ...Array(26).fill().map(() => new Paragraph({ text: "" })),
                    new Paragraph({ children: [new TextRun({ text: "ACİL DURUM PLANI", bold: true, size: 36, font: "Tahoma" })], alignment: "center" }),
                    ...Array(31).fill().map(() => new Paragraph({ text: "" })),
                    new Paragraph({ children: [new TextRun({ text: isyerisehir + " - " + acildurumyil, bold: true, size: 36, font: "Tahoma" })], alignment: "center" }),
                ]
            },
            {
                properties:{page:{margin:{top:1134,bottom:1701,left:1134,right:1134,footer: 1134}}},
                children: [...girisparagraflar],
                footers:
                {
                    default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})
                }
            }
        ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Giriş.docx");
}
function docxucluimzadikey(uzman,uzmanno,hekim,hekimno,isveren){return new docx.Table({width:{size:100,type:docx.WidthType.PERCENTAGE},borders:{top:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},bottom:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},left:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},right:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideHorizontal:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"},insideVertical:{style:docx.BorderStyle.NONE,size:0,color:"FFFFFF"}},rows:[new docx.TableRow({children:[new docx.TableCell({width:{size:33,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:uzman,font:"Calibri",size:22,bold:!0})]})]}),new docx.TableCell({width:{size:34,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:isveren,font:"Calibri",size:22,bold:!0})]})]}),new docx.TableCell({width:{size:33,type:docx.WidthType.PERCENTAGE},children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:hekim,font:"Calibri",size:22,bold:!0})]})]})]}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İş Güvenliği Uzmanı",font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İşveren Vekili",font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"İşyeri Hekimi",font:"Calibri",size:22})]})]})]}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Belge No: "+uzmanno,font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"",font:"Calibri",size:22})]})]}),new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Belge No: "+hekimno,font:"Calibri",size:22})]})]})]})]})}
function acildurumgecerlilik(tarih, tehlike) { if (!tarih) return ""; const [g, a, y] = tarih.split(".").map(Number); if (!g || !a || !y) return ""; let e = 0; switch (tehlike) { case 1: e = 6; break; case 2: e = 4; break; case 3: e = 2; break; default: return "" }const d = new Date(y + e, a - 1, g), p = n => n.toString().padStart(2, "0"); return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}` }
function isyeribaslikayar(a, v) { if (!v || typeof v !== "string" || v.trim().length === 0) { alert("Lütfen geçerli bir veri girin!"); return } const k = v.trim().split(" ").filter(k => k.length > 0); if (k.length === 0) { alert("Geçerli veri girin!"); return } let s = {}; switch (a) { case 1: s = { ustbaslik: k[0], altbaslik: k.slice(1).join(" ") }; break; case 2: if (k.length < 2) { alert("Script 2 için en az 2 kelime gerekli!"); return } s = { ustbaslik: k.slice(0, 2).join(" "), altbaslik: k.slice(2).join(" ") }; break; case 3: if (k.length < 3) { alert("Script 3 için en az 3 kelime gerekli!"); return } s = { ustbaslik: k.slice(0, 3).join(" "), altbaslik: k.slice(3).join(" ") }; break; default: alertify.error("Geçersiz giriş (1, 2 veya 3 olmalı)"); return }return s }

async function acildurumkonusecimdocx()
{
    let acildurumkonular = acildurumkonuliste();
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } = docx;
    const girisparagraflar =
    [
        new Paragraph({children:[new TextRun({text:"İŞYERİ İÇİN BELİRLENEN ACİL DURUMLAR",bold:true,size:24,font:"Calibri"})],spacing:{before:0,after:100},alignment:AlignmentType.CENTER}),
        new Paragraph({children:[new TextRun({text:"\tİşyerinin tamamında veya bir kısmında meydana gelebilecek veya işyerini dışarıdan etkileyebilecek ve ivedilikle müdahale gerektiren acil durumlar aşağıda listelenmiştir.",size:22,font:"Calibri"})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED})
    ];
    const tablosatirlari = [];
    tablosatirlari.push(new TableRow({
        children:
        [
            new TableCell({width:{size:10,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"NO",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:90,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"ACİL DURUM PLAN KONULARI",bold:true,size:22,font:"Calibri"})]})]})
        ]
    }));
    acildurumkonular.forEach((item, index) =>
    {
        tablosatirlari.push(new TableRow({
            children:
            [
                new TableCell({width:{size:10,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:(index+1).toString(),bold:true,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:90,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:140,after:140},indent:{left:60},children:[new TextRun({text:item.ad,size:22,font:"Calibri"})]})]})
            ]
        }));
    });
    const tablo=new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:tablosatirlari,borders:{top:{style:BorderStyle.SINGLE,size:1,color:"000000"},bottom:{style:BorderStyle.SINGLE,size:1,color:"000000"},left:{style:BorderStyle.SINGLE,size:1,color:"000000"},right:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideHorizontal:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideVertical:{style:BorderStyle.SINGLE,size:1,color:"000000"}}});
    const doc = new Document
    ({
        sections:
        [{
            properties: {},
            children: [...girisparagraflar, new Paragraph({ text: ""}), tablo],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Plan Konuları.docx");
}

function acildurumkonuliste(){const a={yangin:"Yangın",deprem:"Deprem",sel:"Sel",sabotaj:"Sabotaj",iskaza:"İş Kazası",elektrik:"Elektrik Çarpması",salgin:"Salgın Hastalık (Covid - 19 vb.)",gida:"Gıda Zehirlenmesi",yildirim:"Yıldırım Düşmesi",basinc:"Basınçlı Kap Patlaması",kmaruziyet:"Kimyasal Maruziyet",ksizinti:"Kimyasal Sızıntı",patlama:"Patlayıcı Ortam",bakim:"Bakım Onarım",hayvan:"Hayvan Sokması Isırması"},b=store.get("acildurumkonusecim");if(!b)return[];const c=[];$.each(b,function(d,e){e==1&&a[d]&&c.push({ad:a[d]})});return c}

async function acildurumisyeririsk()
{
    const liste = [];
    $('table.gridtablo tbody tr').each(function ()
    {
        const unvan = $(this).find('input[name="isyeriunvani"]').val()?.trim();
        const faaliyet = $(this).find('input[name="faaliyetkonu"]').val()?.trim();
        const select = $(this).find('select[name="riskseviyesi"]');
        const riskval = select.val();
        const risktext = select.find('option:selected').text().trim();
        if (!riskval || riskval === "0") return;
        liste.push({isyeri: unvan || '', faaliyet: faaliyet || '', risk: risktext});
    });
    if (liste.length === 0)
    {
        for (let i = 0; i < 3; i++)
        {
            liste.push({ isyeri: '', faaliyet: '', risk: '' });
        }
    }
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, TextRun, Paragraph, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, PageOrientation  } = docx;
    const baslik =
    [
        new Paragraph({children:[new TextRun({text:"İŞYERİNİ DIŞARIDAN ETKİLEYEBİLECEK DİĞER İŞYERLERİ",bold:true,size:24,font:"Calibri"})],spacing:{before:0,after:100},alignment:AlignmentType.CENTER}),
    ];
    const aciklama =
    [
        new Paragraph({children:[new TextRun({text:"\tKabul Edilebilir Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar oluşma ihtimali mümkün, yaralanma veya can kaybı beklenmemektedir.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tOlası Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar oluşur, yaralanma ihtimali düşük ve can kaybı beklenmemektedir.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tÖnemli Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar ve yaralanma meydana gelebilir ve can kaybı olma ihtimali düşüktür.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tYüksek Risk Seviyesi:",bold:true,font:"Calibri",size:22}),new TextRun({text:" İşyeri çevresinde bulunan diğer işyerlerinde yangın vb. bir durum anında işyerimizde fiziksel hasar ve yaralanma meydana gelebilir ve can kaybı olma ihtimali yüksektir.",font:"Calibri",size:22})],alignment:AlignmentType.JUSTIFIED,spacing:{after:100}}),
        new Paragraph({children:[new TextRun({text:"\tRisk seviyesinin belirlenmesinde, işyerinin kaçış mesafesi, acil durum kapı sayısı ve bulunduğu yönler, işyerinin kat sayısı, çalışan sayısı ve yoğunluğu ve diğer işyerinin oluşturabileceği maksimum risk seviyesine göre değerlendirme yapılmıştır.",font:"Calibri",size:22})],spacing:{before:100,after:100},alignment:AlignmentType.JUSTIFIED})
    ];
    const tablosatirlari = [];
    tablosatirlari.push(new TableRow({
        children:
        [
            new TableCell({width:{size:4,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"NO",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"İŞYERİ UNVANI",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"FAALİYET KONUSU",bold:true,size:22,font:"Calibri"})]})]}),
            new TableCell({width:{size:20,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:"ACİL DURUM RİSK SEVİYESİ",bold:true,size:22,font:"Calibri"})]})]})
        ]
    }));
    liste.forEach((item, index) => {
        tablosatirlari.push(new TableRow({
            children:
            [
                new TableCell({width:{size:4,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:(index+1).toString(),bold:true,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:140,after:140},indent:{left:60},children:[new TextRun({text:item.isyeri,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:38,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.LEFT,spacing:{before:140,after:140},indent:{left:60},children:[new TextRun({text:item.faaliyet,size:22,font:"Calibri"})]})]}),
                new TableCell({width:{size:20,type:WidthType.PERCENTAGE},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:140,after:140},children:[new TextRun({text:item.risk,size:22,font:"Calibri"})]})]})
            ]
        }));
    });
    const tablo=new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:tablosatirlari,borders:{top:{style:BorderStyle.SINGLE,size:1,color:"000000"},bottom:{style:BorderStyle.SINGLE,size:1,color:"000000"},left:{style:BorderStyle.SINGLE,size:1,color:"000000"},right:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideHorizontal:{style:BorderStyle.SINGLE,size:1,color:"000000"},insideVertical:{style:BorderStyle.SINGLE,size:1,color:"000000"}}});
    const doc = new Document
    ({
        sections:
        [{
            properties:{page:{size:{orientation:PageOrientation.LANDSCAPE},margin:{top:1134,bottom:1134,left:1134,right:1134}}},
            children: [...baslik, new Paragraph({ text: "" }), tablo, new Paragraph({ text: "" }), ...aciklama],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Diğer İşyerleri.docx");
}


async function acildurumsayfaacilis()
{
    try
    {
        const urls = ['https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/acildurumgenel1_3.json', 'https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/acildurumozel1_4.json'];
        const responses = await Promise.all(urls.map(url => fetch(url)));
        if (responses.some(r => !r.ok)) throw new Error('JSON dosyalarından biri indirilemedi');
        const [geneljson, ozeljson] = await Promise.all(responses.map(r => r.json()));
        const acildurumjsononlem = geneljson;
        const acildurumjsonozel = ozeljson;
        store.set("acildurumgeneljson", geneljson);
        store.set("acildurumozeljson", ozeljson);
        const hastaneResponse = await fetch("https://cdn.jsdelivr.net/gh/MEHMETCERANX12/isgevrak@main/hastaneliste1_2.json");
        if (!hastaneResponse.ok) throw new Error("Hastane JSON indirilemedi");
        const hastaneListesi = await hastaneResponse.json();
        store.set("hastanebilgi", hastaneListesi);
        let hastaneil = [...new Set(hastaneListesi.map(h => h.il))].sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
        const $hastaneselect = $('#hastaneil');
        $hastaneselect.empty();
        $hastaneselect.append('<option value="">İl Seçiniz</option>');
        hastaneil.forEach(il => $hastaneselect.append(`<option value="${il}">${il}</option>`));
        $('#hastaneil').on('change', function ()
        {
            const secilenIl = $(this).val();
            const hastaneListesi = store.get("hastanebilgi") || [];
            const ilceler = [...new Set(hastaneListesi.filter(h => h.il === secilenIl).map(h => h.ilce))].sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
            const $ilceSelect = $('#hastaneilce');
            $ilceSelect.empty();
            $ilceSelect.append('<option value="">İlçe Seçiniz</option>');
            ilceler.forEach(ilce => { $ilceSelect.append(`<option value="${ilce}">${ilce}</option>`);   });
        });
        $('#hastaneilce').on('change', function ()
        {
            const secilenIl = $('#hastaneil').val();
            const secilenIlce = $(this).val();
            const hastaneListesi = store.get("hastanebilgi") || [];
            const hastaneler = hastaneListesi.filter(h => h.il === secilenIl && h.ilce === secilenIlce).map(h => h.hastane).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }));
            const $hastaneisimSelect = $('#hastaneisim');
            $hastaneisimSelect.empty();
            $hastaneisimSelect.append('<option value="">Hastane Seçiniz</option>');
            hastaneler.forEach(h => {$hastaneisimSelect.append(`<option value="${h}">${h}</option>`);});
        });
        let acldurumekiplistesijson = acildurumekipjson();
        $('#acildurumekiptablo').DataTable({
            data: acldurumekiplistesijson,
            ordering: false,
            dom: 't',
            columns:
            [
                { title: "Ad Soyad", data: "ad", orderable: false },
                { title: "Unvan", data: "un", orderable: false },
                { title: "Acil Durum Görevi", data: "ekipgorev", orderable: false }
            ],
            createdRow: function (row, data)
            {
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
                $(row).find('td').eq(2).css('text-align', 'left');
            },
            headerCallback: function (thead)
            {
                $(thead).find('th').css('text-align', 'center');
            }
        });        
        const tarih = store.get("acildurumtarih");
        if (tarih) $("#tarih").val(tarih);
        const acildurumliste = acildurumkonuliste();
        $('#acildurumlistesi').DataTable({
            data: acildurumliste,
            ordering: false,
            dom: 't',
            columns: [{ title: "Acil Durum Plan Konuları", data: "ad", orderable: false }],
            createdRow: row => $(row).find('td').eq(0).css('text-align', 'left'),
            headerCallback: thead => $(thead).find('th').css('text-align', 'center')
        });
        $('#digerisyeri').on('change', 'select[name="riskseviyesi"]', function ()
        {
            const v = $(this).val(), r = $(this).closest('tr');
            let h = '', y = '', c = '';
            switch (v) {
                case '1': h = 'Mümkün'; y = 'Yok'; c = 'Yok'; break;
                case '2': h = 'Oluşur'; y = 'Düşük'; c = 'Yok'; break;
                case '3': h = 'Oluşur'; y = 'Oluşur'; c = 'Düşük'; break;
                case '4': h = 'Oluşur'; y = 'Oluşur'; c = 'Yüksek'; break;
            }
            r.find('td').eq(3).css('text-align', 'center').text(h);
            r.find('td').eq(4).css('text-align', 'center').text(y);
            r.find('td').eq(5).css('text-align', 'center').text(c);
        });
        const acildurumsecim = store.get("acildurumkonusecim");
        if (!acildurumsecim || typeof acildurumsecim !== 'object') {
            console.warn("Seçim verisi bulunamadı veya geçersiz.");
            return;
        }
        let geneltabloveri = [];
        let ozeltabloveri = [];
        const seviyetedbir = parseInt($("#seviyetedbir").val());
        geneltabloveri = acildurumfiltregenel(acildurumjsononlem, seviyetedbir, acildurumsecim);
        ozeltabloveri = acildurumfiltreozel(acildurumjsonozel, seviyetedbir, acildurumsecim);
        $("#seviyetedbir").on("change", function ()
        {
            const yeniseviye = parseInt($(this).val());
            geneltabloveri = acildurumfiltregenel(acildurumjsononlem, yeniseviye, acildurumsecim);
            ozeltabloveri = acildurumfiltreozel(acildurumjsonozel, yeniseviye, acildurumsecim);
            geneltabo.clear().rows.add(geneltabloveri).draw();
            ozeltabo.clear().rows.add(ozeltabloveri).draw();
        });
        var geneltabo = $('#geneltablo').DataTable(
        {
            data: geneltabloveri,
            dom: 'ft',
            pageLength: -1,
            lengthChange: false,
            orderable: false,
            ordering: false,
            columns:
            [
                {title:"Konu",data:"konu",orderable:false},
                {title:"Acil Durum Tedbirleri (Genel)",data:"onlem",orderable:false},
                {title:"Dahil Et",data:null,orderable:false,render:function(){return'<input type="checkbox" class="onlemsec" checked>';}},
                {title:"Uygun",data:null,orderable:false},
                {title: "Uygun Değil", data: null, orderable: false },
                {data: "id", visible: false },
            ],
            language:
            {
                search: "Önlem Ara:",
                zeroRecords: "Böyle bir önlem bulunamadı",
                emptyTable: "Böyle bir önlem bulunamadı"
            },
            createdRow: function (row, data, rowIndex)
            {
                const randomName = "secim_" + Math.random().toString(36).substring(2, 10);
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
                $(row).find('td').eq(2).css('text-align', 'center');
                $(row).find('td').eq(3).html(`<input type="radio" name="${randomName}" value="1" checked>`).css('text-align', 'center');
                $(row).find('td').eq(4).html(`<input type="radio" name="${randomName}" value="0">`).css('text-align', 'center');
            },
            headerCallback: function (thead)
            {
                $(thead).find('th').css('text-align', 'center');
            }
        });
        var ozeltabo = $('#ozeltablo').DataTable(
        {
            data: ozeltabloveri,
            dom: 'ft',
            pageLength: -1,
            lengthChange: false,
            orderable: false,
            ordering: false,
            columns:
            [
                {title:"Konu",data:"konu",orderable:false},
                {title:"Acil Durum Tedbirleri (Konulara Göre)",data:"onlem",orderable:false},
                {title:"Dahil Et",data:null,orderable:false,render:function(){return'<input type="checkbox" class="onlemsec" checked>';}},
                {title:"Uygun",data:null,orderable:false},
                {title: "Uygun Değil", data: null, orderable: false },
                {data: "konuindex", visible: false },
            ],
            language:
            {
                search: "Önlem Ara:",
                zeroRecords: "Böyle bir önlem bulunamadı",
                emptyTable: "Böyle bir önlem bulunamadı"
            },
            createdRow: function (row, data, rowIndex)
            {
                const randomName = "secim_" + Math.random().toString(36).substring(2, 10);
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
                $(row).find('td').eq(2).css('text-align', 'center');
                $(row).find('td').eq(3).html(`<input type="radio" name="${randomName}" value="1" checked>`).css('text-align', 'center');
                $(row).find('td').eq(4).html(`<input type="radio" name="${randomName}" value="0">`).css('text-align', 'center');
            },
            headerCallback: function (thead)
            {
                $(thead).find('th').css('text-align', 'center');
            }
        });
        let acildurumgooglelink = [{ "acildurum": "Yangın", "link": "https://drive.google.com/uc?export=download&id=1K0idDKFidSghUpVnG2UPAOiYJBazVDjL", "konu": "yangin" }, { "acildurum": "Deprem", "link": "https://drive.google.com/uc?export=download&id=1YOQ5X9krcn55vx0jJiolTV1PAdPc1oH1", "konu": "deprem" }, { "acildurum": "Sel", "link": "https://drive.google.com/uc?export=download&id=1GQDqRWm-T6N0EFgm1f6LsPfx7bu9t9JF", "konu": "sel" }, { "acildurum": "Sabotaj", "link": "https://drive.google.com/uc?export=download&id=1J55hgcFR85ZSHC6dybC4lm2A3cTJDFTI", "konu": "sabotaj" }, { "acildurum": "İş Kazası", "link": "https://drive.google.com/uc?export=download&id=1ZRAENBf-RrBT9eT6VBp0S6rPSzOH_lZ7", "konu": "iskaza" }, { "acildurum": "Elektrik Çarpması", "link": "https://drive.google.com/uc?export=download&id=1n3d2lu8wFqCeoV0yX_Lp0bNY8zQBO2qj", "konu": "elektrik" }, { "acildurum": "Salgın Hastalık (Covid - 19 vb.)", "link": "https://drive.google.com/uc?export=download&id=1dJp6Rix_YT9NjlocTRNlLNgzzPnDoA5o", "konu": "salgin" }, { "acildurum": "Gıda Zehirlenmesi", "link": "https://drive.google.com/uc?export=download&id=1eumlJE9GHzEZiwx_VNrryP4BPy8yof8z", "konu": "gida" }, { "acildurum": "Yıldırım Düşmesi", "link": "https://drive.google.com/uc?export=download&id=1_J6G1QIAfD_ydMcYGAVWJOACg3Q9a-QI", "konu": "yildirim" }, { "acildurum": "Basınçlı Kap Patlaması", "link": "https://drive.google.com/uc?export=download&id=1gTiwQuIfJIKxBldX4Oe2LjWkuX0DmNTE", "konu": "basinc" }, { "acildurum": "Kimyasal Maruziyet", "link": "https://drive.google.com/uc?export=download&id=13qvbOMkoLTVSR4IlA36AR9higd6BsA_j", "konu": "kmaruziyet" }, { "acildurum": "Kimyasal Sızıntı", "link": "https://drive.google.com/uc?export=download&id=1M6aKr0kVO0rtu48ddRsZSfHs-gouruYv", "konu": "ksizinti" }, { "acildurum": "Patlayıcı Ortam", "link": "https://drive.google.com/uc?export=download&id=1KVUpzRsfRhUg5988_Ih37FCW-icumoPt", "konu": "patlama" }, { "acildurum": "Bakım Onarım", "link": "https://drive.google.com/uc?export=download&id=1zqvfOiLz51VVo7oZjmpfatruS91XYKhX", "konu": "bakim" }, { "acildurum": "Hayvan Sokması Isırması", "link": "https://drive.google.com/uc?export=download&id=1CWMa-5gaeXNsnc6f9H2QOHE7w8PruJgf", "konu": "hayvan" }];
        const acildurumlistelink = store.get("acildurumkonusecim");
        acildurumgooglelink = acildurumgooglelink.filter(item => acildurumlistelink[item.konu] === 1);
        $('#acildurumyontem').DataTable
        ({
            data: acildurumgooglelink,
            ordering: false,
            dom: 't',
            columns:
            [
                { title: "Acil Durum Müdahale Yöntemleri", data: "acildurum", orderable: false },
                { title: "Acil Durum Plan Konuları", data: "link", orderable: false, render: function (data) {return `<input type="button" class="cssbutontamam" value="İndir" onclick='alertify.error("Lütfen Bekleyiniz...", 2);window.location.href="${data}";' />`;}}
            ],
            createdRow: function (row, data, rowIndex)
            {
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'center');
            },
            headerCallback: thead => $(thead).find('th').css('text-align', 'center')
        });        
        $('.dt-search input').css({"background-color": "white", 'margin-bottom': '0.7vw'}).attr("autocomplete", "off");
        $('.dt-length select').css({ "background-color": "white" });        
    }
    catch (err)
    {
        alertify.error("Beklenmedik bir hata oluştu: " + err);
    }
}
function acildurumfiltregenel(veri, seciliseviye, secimler)
{
    return veri.filter(item => {
        if (seciliseviye === 1 && item.seviye !== 1) return false;
        let secilenVarMi = false;
        for (const key in secimler) {
            if (secimler[key] === 1 && item[key] === 1) {
                secilenVarMi = true;
                break;
            }
        }
        return secilenVarMi;
    });
}
function acildurumfiltreozel(veri, seciliseviye, secimler)
{
    return veri.filter(item => {
        if (seciliseviye === 1 && item.seviye !== 1) return false;
        for (const key in secimler) {
            const kullaniciSecimi = secimler[key];
            const kayitDegeri = item[key];
            if (kullaniciSecimi === 0 && kayitDegeri === 1) {
                return false;
            }
        }
        return true;
    });
}
function acildurumtedbirjsonuret()
{
    const genelData = [];
    const ozelData = [];
    $('#geneltablo tbody tr').each(function () {
        const row = $(this);
        const onlem = row.find('td').eq(1).text().trim();
        const dahilet = row.find('input[type="checkbox"]').is(':checked') ? 1 : 0;

        if (dahilet === 1) {
            const uygunluk = row.find('input[type="radio"]:checked').val() === "1" ? "Uygun" : "Uygun Değil";
            const id = $('#geneltablo').DataTable().row(row).data().id;
            genelData.push({
                onlem: onlem,
                dahil: dahilet,
                uygun: uygunluk,
                id: id
            });
        }
    });

    $('#ozeltablo tbody tr').each(function () {
        const row = $(this);
        const acildurumkonusu = row.find('td').eq(0).text().trim();
        const onlem = row.find('td').eq(1).text().trim();
        const index = $('#ozeltablo').DataTable().row(row).data().konuindex;
        const dahilet = row.find('input[type="checkbox"]').is(':checked') ? 1 : 0;

        if (dahilet === 1) {
            const uygunluk = row.find('input[type="radio"]:checked').val() === "1" ? "Uygun" : "Uygun Değil";
            ozelData.push({
                konu: acildurumkonusu,
                onlem: onlem,
                uygun: uygunluk,
                konuindex: index
            });
        }
    });
    const sonuc =
    {
        genel: genelData,
        ozel: ozelData
    };
    let acildurumgeneljson = genelDataDetayliJsonOlustur(genelData);
    let acildurumozeljson = ozelData;
    let konular = [{ "konu": "Yangın", "konuindex": 10, "id": "yangin" }, { "konu": "Deprem", "konuindex": 11, "id": "deprem" }, { "konu": "Sel", "konuindex": 12, "id": "sel" }, { "konu": "Sabotaj", "konuindex": 13, "id": "sabotaj" }, { "konu": "Elektrik Çarpması", "konuindex": 14, "id": "elektrik" }, { "konu": "Biyolojik Risk (Salgın)", "konuindex": 15, "id": "salgin" }, { "konu": "Gıda Zehirlenmesi", "konuindex": 16, "id": "gida" }, { "konu": "Yıldırım", "konuindex": 17, "id": "yildirim" }, { "konu": "Basınçlı Kap Patlaması", "konuindex": 18, "id": "basinc" }, { "konu": "Patlayıcı Ortam", "konuindex": 19, "id": "kmaruziyet" }, { "konu": "Kimyasal Sızıntı", "konuindex": 20, "id": "ksizinti" }, { "konu": "Kimyasal Maruziyet", "konuindex": 21, "id": "patlama" }, { "konu": "Hayvan Sokması", "konuindex": 22, "id": "bakim" }, { "konu": "Bakım Onarım", "konuindex": 23, "id": "hayvan" }, { "konu": "İş Kazası", "konuindex": 99, "id": "iskaza" }];
    let genelsecim = store.get("acildurumkonusecim");
    konular = konular.filter(k => genelsecim[k.id] === 1);
    const acildurumgenelsonuc = [];
    konular.forEach(k => {
      acildurumgeneljson.forEach(item => {
        if (item[k.id] === 1) {
          acildurumgenelsonuc.push({
            konu: k.konu,
            konuindex: k.konuindex,
            onlem: item.onlem,
            uygun: item.uygun === 1 || item.uygun === "Uygun" ? "Uygun" : "Uygun Değil"
          });
        }
      });
    });
    let wordjson = [];
    let tumIndexler = [...new Set([...acildurumgenelsonuc.map(x => x.konuindex), ...acildurumozeljson.map(x => x.konuindex)])];
    tumIndexler.sort((a, b) => a - b);
        tumIndexler.forEach(index =>
        {
      acildurumgenelsonuc
        .filter(x => x.konuindex === index)
        .forEach(x => wordjson.push(x));
      acildurumozeljson
        .filter(x => x.konuindex === index)
        .forEach(x => wordjson.push(x));
    });
    return wordjson;
}
function acildurumekipjson(){const e={0:"Görevli Değil",1:"İlkyardım Ekibi - Ekip Başı",2:"İlkyardım Ekibi - Ekip Personeli",3:"Söndürme Ekibi - Ekip Başı",4:"Söndürme Ekibi - Ekip Personeli",5:"Koruma Ekibi - Ekip Başı + Koordinasyon",6:"Koruma Ekibi - Ekip Personeli + Koordinasyon",7:"Koruma Ekibi - Ekip Personeli",8:"Kurtarma Ekibi - Ekip Başı",9:"Kurtarma Ekibi - Ekip Personeli",10:"Destek Elemanı"};let n=$('#HiddenField1').val();if("string"==typeof n)try{n=JSON.parse(n)}catch(t){console.error("JSON parse hatası:",t),n=[]}const i=[];return $.each(n,function(n,t){t.a&&0!==t.a&&i.push({ad:t.ad,un:t.un,ekipgorev:e[t.a]||"Tanımsız",ekipkod:t.a})}),i}
function genelDataDetayliJsonOlustur(genelData) {
    const acildurumgeneljson = store.get("acildurumgeneljson");
    const yeniJson = genelData
        .map(gItem => {
            const detay = acildurumgeneljson.find(jItem => jItem.id == gItem.id);
            if (!detay) return null;
            return {
                onlem: gItem.onlem,
                id: gItem.id,
                uygun: gItem.uygun,
                yangin: detay.yangin,
                deprem: detay.deprem,
                sel: detay.sel,
                sabotaj: detay.sabotaj,
                iskaza: detay.iskaza,
                elektrik: detay.elektrik,
                salgin: detay.salgin,
                gida: detay.gida,
                yildirim: detay.yildirim,
                basinc: detay.basinc,
                kmaruziyet: detay.kmaruziyet,
                ksizinti: detay.ksizinti,
                patlama: detay.patlama,
                bakim: detay.bakim,
                hayvan: detay.hayvan
            };
        })
        .filter(item => item !== null);
    return yeniJson;
}


function acildurumtedbirdocxyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let wordjson = acildurumtedbirjsonuret();
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun, AlignmentType, PageOrientation, HeightRule  } = docx;
    const tableRows = [];
    const headerRow = () => new docx.TableRow({
        height: { value: 680, rule: docx.HeightRule.EXACT },
        children:
        [
            new docx.TableCell({width: { size: 15, type: WidthType.PERCENTAGE },verticalAlign: docx.VerticalAlign.CENTER, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "ACİL DURUM", bold: true, font: "Calibri", size: 22 })]})]}),
            new docx.TableCell({width: { size: 75, type: WidthType.PERCENTAGE },verticalAlign:docx.VerticalAlign.CENTER,children:[new docx.Paragraph({alignment: docx.AlignmentType.CENTER, children:[new docx.TextRun({text:"ÖNLEYİCİ ve SINIRLANDIRICI TEDBİRLER",bold:true,font:"Calibri",size:22})]})]}),
            new docx.TableCell({width: { size: 10, type: WidthType.PERCENTAGE },verticalAlign: docx.VerticalAlign.CENTER, children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: "UYGUNLUK", bold: true, font: "Calibri", size: 22 })] })] })
        ]
    });
    tableRows.push(headerRow());
    wordjson.forEach((item, index) => {

        if (index > 0 && index % 12 === 0)
        {
            tableRows.push(headerRow());
        }
        tableRows.push(new TableRow(
        {
            height: { value: 680, rule: HeightRule.EXACT },
            children:
            [
                new TableCell({verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:docx.AlignmentType.CENTER,children:[new TextRun({text:item.konu,font:"Calibri",size:22})]})]}),
                new TableCell({margins:{left:150, right:150},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:docx.AlignmentType.JUSTIFIED,children:[new TextRun({text:item.onlem,font:"Calibri",size:22})]})]}),
                new TableCell({verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:docx.AlignmentType.CENTER,children:[new TextRun({text:item.uygun,font:"Calibri",size:22})]})]})
            ]
        }
        ));
    });

    const table = new Table({
        rows: tableRows,
        width: {
            size: 100,
            type: WidthType.PERCENTAGE
        }
    });

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {top: 850, bottom: 1950, left: 850, right: 850, footer:1100},
                    size:
                    {
                        orientation: PageOrientation.LANDSCAPE,
                    }
                }
            },
            children: [table],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    Packer.toBlob(doc).then(blob => { saveAs(blob, "Acil Durum Kontrol Listesi.docx");});
}

async function ulusalacildurumnumarayaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    let isveren = isyeri.is;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, BorderStyle } = window.docx;
    const tableRows = [];
    tableRows.push(
    new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:[new docx.TableCell({columnSpan:2,children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Ulusal Acil Durum Numaraları",bold:true,font:"Calibri",size:22})]})],width:{size:100,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER})]
    }));
    tableRows.push(new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:
        [
            new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Kurum Adı",bold:true,font:"Calibri",size:22})]})],width:{size:80,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER}),
            new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"Telefon No",bold:true,font:"Calibri",size:22})]})],width:{size:20,type:docx.WidthType.PERCENTAGE},verticalAlign:docx.VerticalAlign.CENTER})
        ]
    }));
    tableRows.push(new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:
        [
            new docx.TableCell({margins:{left:75},children:[new docx.Paragraph({alignment:docx.AlignmentType.LEFT,children:[new docx.TextRun({text:"İtfaiye",font:"Calibri",size:22,bold:false})]})],verticalAlign:docx.VerticalAlign.CENTER}),
            new docx.TableCell({children:[new docx.Paragraph({alignment:docx.AlignmentType.CENTER,children:[new docx.TextRun({text:"112",bold:false,font:"Calibri",size:22})]})],rowSpan:7,verticalAlign:docx.VerticalAlign.CENTER})
        ]
    }));
    ["Polis", "Sağlık - Ambulans", "AFAD", "Jandarma", "Orman Yangın", "Sahil Güvenlik"].forEach(name =>{
    tableRows.push(new docx.TableRow
    ({
        height: { value: 566, rule: docx.HeightRule.EXACT },
        children:[new docx.TableCell({margins:{left:75},children:[new docx.Paragraph({alignment:docx.AlignmentType.LEFT,children:[new docx.TextRun({text:name,bold:false,font:"Calibri",size:22})]})],verticalAlign:docx.VerticalAlign.CENTER})]}));
    });
    const others =
    [
        { kurum: "Ulusal Zehir Danışma Merkezi", tel: "114" },
        { kurum: "Sağlık Bakanlığı İletişim Merkezi", tel: "184" },
        { kurum: "Doğalgaz Arıza", tel: "187" },
        { kurum: "Telefon Arıza", tel: "121" },
        { kurum: "Su Arıza", tel: "185" },
        { kurum: "Elektrik Arıza", tel: "186" },
        { kurum: "Gıda İhbar Hattı", tel: "174" },
        { kurum: "Zabıta", tel: "153" },
    ];
    others.forEach(({ kurum, tel }) =>
    {
        tableRows.push(new docx.TableRow({
            height: { value: 566, rule: docx.HeightRule.EXACT },
            children:
            [
                new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: kurum, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER, margins: { left: 75 } }),
                new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: tel, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER })
            ]
        }));
    });
    let hastaneadi = $('#hastaneadi').val();
    let hastaneadres = $('#hastaneadres').val();
    let hastanetel = $('#hastanetel').val();
    if (hastaneadi && hastaneadi.trim() !== "")
    {
        tableRows.push(new docx.TableRow({
            height: { value: 566, rule: docx.HeightRule.AT_LEAST },
            children:
            [
                new docx.TableCell({ children: [new docx.Paragraph({ children: [new docx.TextRun({ text: hastaneadi, font: "Calibri", size: 22 }), new docx.TextRun({ break: 1 }), new docx.TextRun({ text: hastaneadres, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER, margins: { left: 75 } }),
                new docx.TableCell({ children: [new docx.Paragraph({ alignment: docx.AlignmentType.CENTER, children: [new docx.TextRun({ text: hastanetel, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER })
            ]
        }));
    }
    const table = new Table
    ({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER,
    });
    const doc = new Document({
        sections:
        [{
            properties: { page: {margin: {top: 850, bottom: 1950, left: 850, right: 850, footer:1100}}},
            children: [table],
            footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)]})}
        }]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Numaraları.docx");
}

function acildurumhastaneyaz()
{
    const secilenIl = $('#hastaneil').val();
    const secilenIlce = $('#hastaneilce').val();
    const secilenHastane = $('#hastaneisim').val();
    if (!secilenIl || !secilenIlce || !secilenHastane)
    {
        alert('Lütfen İl, İlçe ve Hastane seçiniz.');
        return;
    }
    const hastaneListesi = store.get("hastanebilgi") || [];
    const secilen = hastaneListesi.find(h =>
        h.il === secilenIl &&
        h.ilce === secilenIlce &&
        h.hastane === secilenHastane
    );
    if (secilen)
    {
        $('#hastaneadi').val(secilen.hastane);
        $('#hastaneadres').val(secilen.adres);
        $('#hastanetel').val(secilen.telefon);
        $('#hastanebulucu').fadeOut();
    }
    else
    {
        alert('Seçilen hastane bilgisi bulunamadı.');
    }
}

async function acildurumekiplistesidocx()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    let adres = isyeri.ad;
    let isyerisicil = isyeri.sc;
    let isveren = isyeri.is;
    let isyeriadi = isyeri.fi;
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let acldurumekiplistesijson = acildurumekipjson();
    const { Document, Packer, Paragraph, TextRun, TableCell, WidthType, AlignmentType, PageBreak} = window.docx;
    let analiste = [];
    analiste.push(new docx.TableRow
    ({
        height: { value: 567, rule: docx.HeightRule.EXACT },
        children:
        [
            new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Çalışan Ad Soyadı", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Acil Durum Ekip Görevi", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sorumluluk Alanı", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İletişim No", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER }),
            new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 24, bold: true })] })], verticalAlign: docx.VerticalAlign.CENTER })
        ]
    }));
    acldurumekiplistesijson.forEach(person =>
    {
        analiste.push(new docx.TableRow({
            height: { value: 850, rule: docx.HeightRule.EXACT },
            children: [
                new TableCell({margins: { left: 75 }, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: person.ad, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({margins: { left: 75 }, children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: person.ekipgorev, font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({margins: { left: 75 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: " ", font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: " ", font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER }),
                new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: " ", font: "Calibri", size: 22 })] })], verticalAlign: docx.VerticalAlign.CENTER })
            ],
            
        }));
    });
    let acildurumanatablo = new docx.Table({ rows: analiste, width: { size: 100, type: docx.WidthType.PERCENTAGE } });
    ////////////////////////////////////////
    const gorevlendirmesayfa = [];
    let calisanunvan = "";
    acldurumekiplistesijson.forEach((calisan, index) =>
    {
        const ekipindex = parseInt(calisan.ekipkod, 10);
        let imzaliste = [];
        if(ekipindex===5||ekipindex===6||ekipindex===7)calisanunvan="Koruma Ekibi";else if(ekipindex===3||ekipindex===4)calisanunvan="Söndürme Ekibi";else if(ekipindex===1||ekipindex===2)calisanunvan="İlkyardım Ekibi";else if(ekipindex===8||ekipindex===9)calisanunvan="Kurtarma Ekibi";else calisanunvan="Destek Elemanı";
        imzaliste.push
        (
            new docx.TableRow
            ({
                height: { value: 300, rule: docx.HeightRule.EXACT },
                children:
                [
                    new TableCell({ width: { size: 50, type: docx.WidthType.PERCENTAGE }, borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } }, verticalAlign: docx.VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisan.ad, font: "Calibri", size: 22, bold: true })] })] }),
                    new TableCell({width:{size:50,type:docx.WidthType.PERCENTAGE},borders:{top:{size:0,color:"FFFFFF"},bottom:{size:0,color:"FFFFFF"},left:{size:0,color:"FFFFFF"},right:{size:0,color:"FFFFFF"}},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:isveren,font:"Calibri",size:22, bold: true })]})]})
                ],            
            }),
            new docx.TableRow
            ({
                height: { value: 300, rule: docx.HeightRule.EXACT },
                children:
                [
                    new TableCell({ borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } }, verticalAlign: docx.VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: calisanunvan, font: "Calibri", size: 22})] })] }),
                    new TableCell({ borders:{top:{size:0,color:"FFFFFF"},bottom:{size:0,color:"FFFFFF"},left:{size:0,color:"FFFFFF"},right:{size:0,color:"FFFFFF"}},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"İşveren Vekili" ,font:"Calibri",size:22})]})]})
                ],            
            }),
            new docx.TableRow
            ({
                height: { value: 300, rule: docx.HeightRule.EXACT },
                children:
                [
                    new TableCell({ borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } }, verticalAlign: docx.VerticalAlign.CENTER, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "İmza", font: "Calibri", size: 22})] })] }),
                    new TableCell({ borders:{top:{size:0,color:"FFFFFF"},bottom:{size:0,color:"FFFFFF"},left:{size:0,color:"FFFFFF"},right:{size:0,color:"FFFFFF"}},verticalAlign:docx.VerticalAlign.CENTER,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"İmza" ,font:"Calibri",size:22})]})]})
                ],            
            })
        );
        let imzatablo = new docx.Table({ rows: imzaliste, width: { size: 100, type: docx.WidthType.PERCENTAGE } });
        gorevlendirmesayfa.push
        (
            new Paragraph({ text: `ACİL DURUM MÜDAHALE EKİP GÖREVLENDİRMESİ`, spacing: { after: 200 }, style: "Baslik" }),
            new Paragraph({ text: `\tİşyeri Unvanı: ${isyeriadi}`, spacing: { after: 100 }, style: "Normal" }),
        );
        if (adres && adres.trim() !== "")
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tAdres: ${adres}`, spacing: { after: 100 }, style: "Normal" }));
        }
        if (isyerisicil && isyerisicil.trim() !== "")
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tSGK Sicil No: ${isyerisicil}`, spacing: { after: 100 }, style: "Normal" }));
        }
        gorevlendirmesayfa.push(new Paragraph({ text: `\tÇalışan Ad Soyadı: ${calisan.ad}`, spacing: { after: 100 }, style: "Normal" }));
        if (calisan.un && calisan.un.trim() !== "")
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tÇalışan Unvan: ${calisan.un}`, spacing: { after: 100 }, style: "Normal" }));
        };
        gorevlendirmesayfa.push(new Paragraph({ text: `\tEkip Görevi: ${calisan.ekipgorev || ""}`, spacing: { after: 200 }, style: "Normal" }));
        gorevlendirmesayfa.push(new Paragraph({ text: `\tİşyeri unvanı ve adı soyadı yukarıda yazılı olan çalışan, 6331 Sayılı İş Sağlığı ve Güvenliği Kanununu 11.Maddesi ile İşyerlerinde Acil Durumlar Hakkında Yönetmelik kapsamında aşağıda belirtilen görevleri yürütmek ve uygulamak amacı ile atama yolu ile görevlendirilmiştir. 6698 Sayılı Kişisel Verilerin Korunması Kanunu çerçevesinde kimlik ve iletişim bilgilerimin işyerinde ilan edilerek aktarılacağı konusunda bilgilendirildim ve özgür iradem ile açık rıza gösterdim.`, spacing: { after: 200 }, style: "Normal" }));
        if (ekipindex === 5 || ekipindex === 6 || ekipindex === 7)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tKoruma Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t1-) Acil durum planında belirtilen müdahale ve hareket planına uygun şekilde hızlı ve etkin hareket etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t2-) Olay yerine gelen çalışan yakınlarını sakinleştirmek ve uygun bilgilendirmeyi sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t3-) Güvenlik amacıyla olay yerinde kontrollü alan oluşturmak, sadece yetkili kişilerin (İtfaiye, ambulans, polis vb.) geçişine izin vermek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t4-) Söndürme, ilkyardım ve diğer ekiplerle etkin iletişim ve koordinasyonu sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t5-) Acil çıkış yollarının ve toplanma alanlarının açık ve güvenli kalmasını sağlamak, kalabalık veya panik oluşumunu önlemek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t6-) Tahliye sırasında özel ihtiyaç sahibi çalışanlara yardımcı olmak. (engelliler, hamileler vb.)`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        else if (ekipindex === 3 || ekipindex === 4)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tSöndürme Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t1-) İşyerinde hazırlanmış acil durum planındaki müdahale adımlarına uygun şekilde yangın olaylarına müdahale etmek.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t2-) Yangın söndürme ekipmanlarının (yangın tüpleri, hortumlar vb.) sürekli çalışır durumda ve erişilebilir olmasını sağlamak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t3-) Yangın çıktığında, en kısa sürede olay yerine intikal ederek yangına uygun ekipmanla güvenli şekilde ilk müdahaleyi yapmak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t4-) Yangın tamamen söndürüldükten sonra, yeniden alevlenme riskine karşı olay yerini gözetim altında tutmak ve terk etmemek.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t5-) Koruma, Kurtarma ve İlkyardım ekipleriyle koordinasyon içinde çalışarak yangının büyümesini ve can kaybını önlemeye yönelik görev almak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        else if (ekipindex === 1 || ekipindex === 2)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tİlkyardım Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t1-) İşyerinde hazırlanmış acil durum planındaki hareket ve müdahale adımlarına uygun şekilde hareket etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t2-) Acil durumda anında yaralıların tespitini yapmak; durumu ağır olandan başlamak üzere ilkyardım uygulamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t3-) Yaralının ambulans gelene kadar hayati fonksiyonlarını sürdürebilmesi için gerekli müdahaleleri yapmak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t4-) Sağlık ekipleri geldikten sonra durumu aktarmak ve sağlık ekiplerine gerekli desteği sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t5-) Olay yeri ve kişisel güvenliği sağlamak; yaralıları tehlike kaynağından uzaklaştırarak güvenli bir alanda müdahale etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        else if (ekipindex === 8 || ekipindex === 9)
        {
            gorevlendirmesayfa.push(new Paragraph({ text: `\tKurtarma Ekibinin Görevleri`, spacing: { after: 100 }, style: "Kalin" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tİşyerinde hazırlanmış acil durum planında belirtilen hareket ve müdahale planına uygun şekilde müdahale etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tAcil durum anında tehlikeli bölgede bulunan kişileri hızlı ve güvenli bir şekilde tahliye etmek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tYaralı veya kendi başına tahliye olamayan kişilerin güvenli bir şekilde tehlikeli bölgeden çıkarılmasını sağlamak,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tPolis, İtfaiye, AFAD, Ambulans vb. resmi müdahale ekipleriyle koordinasyon sağlamak ve ihtiyaç duyulursa olayla veya kişilerin durumu ile ilgili bilgi vermek,`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\tKoruma, Söndürme ve İlkyardım ekipleriyle koordineli şekilde çalışmak.`, spacing: { after: 100 }, style: "Normal" }));
            gorevlendirmesayfa.push(new Paragraph({ text: `\t`, style: "Normal" }), imzatablo);
        }
        if (index !== acldurumekiplistesijson.length - 1)
        {
            gorevlendirmesayfa.push(new Paragraph({ children: [new PageBreak()] }));
        }
    });
    const doc = new docx.Document
    ({
        styles:
        {
            paragraphStyles:
            [
                {id: "Normal", run: { font: "Calibri", size: 22 }, paragraph: {alignment: AlignmentType.JUSTIFIED }},
                {id: "Kalin", run: { font: "Calibri", size: 22, bold: true }, paragraph: {alignment: AlignmentType.JUSTIFIED }},
                {id: "Baslik", run: { font: "Calibri", size: 24, bold: true }, paragraph: { alignment: AlignmentType.CENTER }}
            ]
        },
        sections:
        [
            {properties:{page:{size:{orientation:docx.PageOrientation.PORTRAIT},margin:{top:1134,right:851,bottom:1134,left:851}}},children:[...gorevlendirmesayfa],footers:{default:new docx.Footer({children:[]})}},
            {properties:{page: { size: { orientation: docx.PageOrientation.LANDSCAPE }, margin: { top: 1134, right: 851, bottom: 1134, left: 851 } } }, children: [acildurumanatablo], footers: { default: new docx.Footer({ children: [docxucluimzadikey(uzmanad, uzmanno, hekimad, hekimno, isveren)] }) } },
        ]
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Acil Durum Ekip Listesi.docx");
}


function acildurumsertifikakontrol()
{
    $('#loading').show();
    $.when(acildurumegitimpdf())
    .done(function ()
    {
        alertify.error("Dosya indirildi", 7);
    })
    .fail(function ()
    {
        alertify.error("Bir hata oluştu.", 7);
    })
    .always(function ()
    {
        $('#loading').hide();
    });
}
async function acildurumegitimpdf()
{
    const iconBase64 = 'data:image/png;base64,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AADGPwAIACACAGD8A4AAACIAAMY/AAgAIAIAYPwDgAAAIgAAxj8ACAAgAgAY/8Y/AAgAIAIAGP8AgAAAIgCA8Q8ACAAgAgAY/wAgAAAiAIDxDwACACACABj/ACAAgAgAgPEPAAIAiAAAGP8AIACACABg/AMAAgCIAADGPwAgAIAIAGD8AwACAIgAAMY/AAgAgAgAYPwDgAAAiAAAxj8ACACACABg/AOAAAAigAgAGP8AgAAAIgCA8Q8ACAAgAgAY/wCAAAAiAIDxDwAIACACABj/ACAAACIAgPEPAAIAIAIAGP8AIAAAIgCA8Q8AAgAgAgDGPwAgAAAiAGD8AwACAIgAAMY/ACAAgAgAYPwDAAIAiAAAxj8ACACOAEQAAOMfAAQAQAQAMP4BQAAARADA+AcABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAABFABACMfwBAAAARAMD4BwAEABABAIx/ABAAABEAMP4BAAEAEAEA4x8AEAAAEQAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEARAAA4x8ABABABACMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARADA+AcABABABACMfwBAAABEADD+AQABABABRAAw/gEAAQAQAQDjHwAQAAARADD+AQABABABAOMfABAAABEAMP4BAAEAEAEA4x8AEAAAEQCMf+MfABAAABEAjH8AAAEAEAHA+AcABAAAEQCMfwBAAABEAMD4BwAEAEAEAIx/AEAAAEQAwPgHAAQAQAQAjH8AQAAARAAw/gEABABABADjHwBAAABEADD+AQABAEAEAOMfABAAAEQAMP4BAAEAEAFEADD+AQABABABAOMfABAAABEAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABwPgHAAQAABEAjH8AQAAAEAHA+AcABABABADjHwBAAABEADD+AQAEAEAEAOMfAEAAAEQAMP4BAAQAQAQA4x8AEAAARAAw/gEAAQBABADjHwAQAABEAIx/AAABAEAEwPgHABAAAEQAjH8AAAEAEAHA+AcAEAAAEQCMfwAAAQAQAcD4BwAEAAARAIx/AEAAABABMP4BAAQAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAEAEEAEw/gEABABABADjHwAQAABEADD+AQABAEAEwPgHABAAAEQAjH8AAAEAQATA+AcAEAAARACMfwAAAQBABMD4BwAQAABEAIx/AAABAEAEwPgHABAAABEA4x8AQAAAEAEw/gEABAAAEQDjHwBAAAAQATD+AQAEAAARAOMfAEAAABABMP4BAAQAABEA4x8AQAAAOHcEMBiNfwCAsG46AoCiaNv2l/R6XZZllf5y6kSMfwAAAQAgdggQAYYp38Xx5zT+/+ooAAA+zkcAAP5PGpEP0tsDJzGo8X83/b4dOQoAAAEAYNMIcJje7nXjkv7KD2/8Kv1+eYgjAIAAAHDuCJB/ouwbAvrrsFj/5F+kAQA4gx1HAHC63d3dSXp7kV57TqM3POwPAGBDHgII8AndNwT8rSzLn9Nf3kmvW07l2uS7Mf6Yxv/fHQUAwGZ8BADgjNLofFb4SMB1en/+Pu8PAHA+PgIAcA67u7tP0ttjJ3EllsX6lv+5owAAOD93AACcQxqjOQDcLtwNcNnyT/1vG/8AANtzBwDAlnZ3dx8V67sBJk7jwuSwsm/4AwAIAAB9iwB5/B+k18xpbGXVDf9DRwEAIAAA9DkEVF0I8JWBmw//5+n1LI3/leMAABAAAIYSAupi/bGA2mkY/gAAAgDAOELA/cJHAwx/AAABAGAUIaAq1ncE5I8GjPlhgctu+B8a/gAAAgBA5BAw6SLAw/Sajugf/TC9XnqqPwCAAAAwxhiQA8D9LghUAf8R81f55Z/2H/lpPwCAAABArBgwT6/X3ehf+p0FABAAAPjtGFB1IeCbYv0tAn1+ZsDyg9E/95N+AAABAIDzB4F8d8C0CwInv74Oedzn2/qPu/eFn/IDAAgAAFx+FKi6GPBl9+vJBcWBefd+/MFfL419AAABAID+BYKNYoCn8wMAAAAAAARwwxEAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAAAAgAAAAAgAAAAAAACAAAAACAAAAAAAAIAAAAAIAAAAAAAAgAAAAAgAAAAAIAAAAAAAAgAAAAAgAAAAAAACAAAAMB/2bEDGQAAAIBB/tb3+AojAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAAAgAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAACAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAAABAAAAAAgAAAAAQAAAAAAAAgAAAAAEAAAAACAAAAAAAAEAAAAACAAAAABAAAAAAAACAAAAABAAAAAAgAAAAAAAAQAAAAAIAAAAAEAAAAAAAAIAAAAAEAAAAACAAAAAAAAEAAAAACAAAAAAQAAAAAAAAgAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAAAAQAAAAAIAAAAAEAAAAAAgAAAAAAAFhJAgAEApKo6nvcfVk8AAAAASUVORK5CYII=';
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri);
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanliste = acildurumekipjson();
    let isyeriadi = isyeri.fi;
    let isverenvekili = isyeri.is;
    let egitimtarih = $("#admetarih").val() || "......./......./20...";
    let egitimsaat = $("#admesaat").val();
    let egitimyeri = "Örgün";
    let bosluk = 45;
    let egitimicerik = { "baslik": "ACİL DURUM EĞİTİMİ KATILIM SERTİFİKASI", "paragraf": "\u200B\t\t\tAdı ve soyadı yukarıda yazılı olan çalışan, “İşyerlerinde Acil Durumlar Hakkında Yönetmeliği Madde-15” kapsamında aşağıda yer alan konularda eğitim programına katılmış ve başarılı olmuştur.", "maddeler": ["İşyerinde oluşabilecek acil durumlar", "Acil durum sırasında alınacak tedbirler ve hareket planı", "İlkyardım ekibinin görev ve sorumlulukları", "Yangın söndürme ekibinin görev ve sorumlulukları", "Arama, kurtarma ve tahliye ekibinin görev ve sorumlulukları", "Koordinasyon ve koruma ekibinin görev ve sorumlulukları"] };
    const docDefinition =
    {
        images: { tickIcon: iconBase64,}, styles: {ustbaslik: { fontSize: 14, bold: true, alignment: 'center' }, normalsatir: { fontSize: 11, alignment: 'justify' }},
        pageOrientation: 'landscape',
        content: calisanliste.map((calisan, index) =>
        {
            const ekipindex = parseInt(calisan.ekipkod, 10);
            let calisanunvan = "";
            if(ekipindex===5||ekipindex===6||ekipindex===7)calisanunvan="Koruma Ekibi";else if(ekipindex===3||ekipindex===4)calisanunvan="Söndürme Ekibi";else if(ekipindex===1||ekipindex===2)calisanunvan="İlkyardım Ekibi";else if(ekipindex===8||ekipindex===9)calisanunvan="Kurtarma Ekibi";else calisanunvan="Destek Elemanı";
            const content =
            [
                { text: egitimicerik.baslik, style: 'ustbaslik', margin: [0, 50, 0, 10] },
                { text: 'İşyeri Unvanı: ' + isyeriadi, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Katılımcı Adı Soyadı: ' + calisan.ad, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Katılımcının Görev Unvanı: ' + calisanunvan, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Tarih: ' + egitimtarih, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Eğitim Süresi: ' + egitimsaat, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: 'Eğitim Şekli: ' + egitimyeri, style: 'normalsatir', margin: [80, 0, 0, 5] },
                { text: egitimicerik.paragraf, style: 'normalsatir', margin: [46, 0, 50, 5] },
                ...egitimicerik.maddeler.map(madde => ({
                columns:
                [
                    {
                    image: 'tickIcon',
                    width: 11,
                    height: 14,
                    margin: [80, 0, 0, 0]
                    },
                    {
                    text: madde,
                    style: 'normalsatir',
                    margin: [85, 0, 50, 0]
                    }
                ],
                columnGap: 5,
                margin: [0, 2, 0, 2]
                })),
                { text: '', margin: [0, bosluk] },
                genelucluimzatablo(uzmanad, isverenvekili, hekimad, uzmanno, hekimno)
            ];
            if (index < calisanliste.length - 1)
            {
                content.push({ text: '', pageBreak: 'after' });
            }
            return content;
        }).flat()
    };
    sertifikaarkaplan(docDefinition);
    const blob = await new Promise((resolve, reject) =>
    {
        pdfMake.createPdf(docDefinition).getBlob((blob) => blob ? resolve(blob) : reject(new Error("PDF oluşturulamadı")));
    });
    saveAs(blob, 'ADME Eğitim.pdf');
}

async function acildurumkatılımlistesiyaz()
{
    let uzmanad = store.get("uzmanad");
    let uzmanno = store.get("uzmanno");
    let isyeri = store.get('xjsonfirma');
    isyeri = JSON.parse(isyeri || '{}');
    let hekimad = isyeri.hk;
    let hekimno = isyeri.hn;
    let calisanliste = acildurumekipjson();
    if (!Array.isArray(calisanliste) || calisanliste.length === 0)
    {
        calisanliste = Array.from({ length: 13 }, () => ({ ad: "", un: "" }));
    }
    let isyeriismi = isyeri.fi;
    let egitimsaat = $("#admesaat").val();
    let egitimyeri = "Örgün";
    let egitimtarih = $("#admetarih").val() || "......./......./20...";
    const katilimlistesi = { pageMargins: [25, 25, 25, 25], content: [] };
    let egitimicerik = {"katilim": "ACİL DURUM EĞİTİMİ - EĞİTİM KATILIM TUTANAĞI", "baslik": "ACİL DURUM EĞİTİMİ KATILIM SERTİFİKASI", "paragraf": "\u200B\t\t\tAdı ve soyadı yukarıda yazılı olan çalışan, “İşyerlerinde Acil Durumlar Hakkında Yönetmeliği Madde-15” kapsamında aşağıda yer alan konularda eğitim programına katılmış ve başarılı olmuştur.", "maddeler": ["İşyerinde oluşabilecek acil durumlar", "Acil durum sırasında alınacak tedbirler ve hareket planı", "İlkyardım ekibinin görev ve sorumlulukları", "Yangın söndürme ekibinin görev ve sorumlulukları", "Arama, kurtarma ve tahliye ekibinin görev ve sorumlulukları", "Koordinasyon ve koruma ekibinin görev ve sorumlulukları"] };
    let konu = egitimicerik.maddeler.join(', ');
    function createParticipantTable(startIndex, endIndex)
    {
        let tableBody = [];
        tableBody.push(...digerkatilimustbilgi(isyeriismi, egitimtarih, egitimyeri, egitimsaat, konu, egitimicerik.katilim));
        for (let i = startIndex; i < endIndex; i++)
        {
            const calisan = calisanliste[i];
            tableBody.push([
                { text: (i + 1).toString(), alignment: 'center', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.ad || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: calisan.un || '', alignment: 'left', fontSize: 10, margin: [0, 11, 0, 11] },
                { text: '' }
            ]);
        }
        tableBody.push(
            [
                { text: uzmanad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: hekimad, alignment: 'center', fontSize: 10, bold: true, colSpan: 2, margin: [0, 0] },
                { text: '' },
            ],
            [
                { text: 'İş Güvenliği Uzmanı - Belge No: ' + uzmanno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' },
                { text: 'İşyeri Hekimi - Belge No: ' + hekimno, alignment: 'center', fontSize: 10, colSpan: 2, margin: [0, 0] },
                { text: '' },
            ],
            [
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' },
                { text: '', colSpan: 2, margin: [25, 25] },
                { text: '' },
            ]
        );
        return {
            table: {
                widths: [25, "*", "auto", 100],
                body: tableBody
            },
        };
    }
    const chunkSize = 13;
    for (let i = 0; i < calisanliste.length; i += chunkSize)
    {
        const endIndex = Math.min(i + chunkSize, calisanliste.length);
        katilimlistesi.content.push(createParticipantTable(i, endIndex));
        if (endIndex < calisanliste.length)
        {
        katilimlistesi.content.push({ text: '', pageBreak: 'after' });
        }
    }
    pdfMake.createPdf(katilimlistesi).getBlob(function (blob) { saveAs(blob, 'Katılım Listesi.pdf');});
}
function acildurumustbilgi(i, t, e, s, k, bas)
{
    return [
        [{ text: bas, colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: `İşyeri Unvanı: ${i}`, colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2] }, '', '', ''],
        [{ colSpan: 4, alignment: 'left', fontSize: 10, margin: [2, 2], text: [{ text: `Eğitim Tarihi: ${t}\t\t\t\tEğitim Şekli: ${e}\t\t\t\tSüresi: ${s}` }] }, '', '', ''],
        [{ text: 'EĞİTİM KONULARI', colSpan: 4, alignment: 'center', fontSize: 11, bold: true, margin: [2, 2] }, '', '', ''],
        [{ text: k, colSpan: 4, alignment: 'justify', fontSize: 10, margin: [0, 5] }, '', '', ''],
        [{ text: 'Sıra', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Ad Soyad', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'Unvan', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }, { text: 'İmza', alignment: 'center', fontSize: 10, margin: [1, 1], bold: true }]
    ];
}


function isyeriyeniload()
{
    let json = $('#HiddenField1').val();
    if (json)
    {
        try
        {
            json = JSON.parse(json);
            $.each(json,function(i,e){$("#hk").append($("<option>",{value:e.ad+"|"+e.no,text:e.ad}))});
        }
        catch (e)
        {
            alertify.error('Beklenmedik bir hata oluştu');
        }
    }
}
function isyeriekletamam()
{
    try
    {
        let id = metinuret(10);
        $('#iduret').val(id);
        let fi = $('#fi').val().trim();
        let fk = $('#fk').val().trim();
        let isv = $('#is').val().trim();
        let ad = $('#ad').val().trim();
        let sh = $('#sh').val();
        let sc = $('#sc').val().trim();
        let hk = $('#hk').val().split('|')[0];
        let hn = $('#hk').val().split('|')[1];
        let tehlikesinifimap = new Map([["Az Tehlikeli",1],["Tehlikeli",2],["Çok Tehlikeli",3]]);
        let tssecim = $('#ts').val();
        let ts = tehlikesinifimap.get(tssecim) || 0;
        if (!fi || !isv || !sh || ts === 0)
        {
            alertify.error("Zorunlu alanları doldurunuz.");
            return false;
        }

        let yeniFirma = { id: id, fi: fi, fk: fk, is: isv, ad: ad, ts: ts, sh: sh, sc: sc, hk: hk, hn: hn };
        let firmajson = store.get('firmajson');
        if (typeof firmajson === "string")
        {
            firmajson = JSON.parse(firmajson);
        }
        else if (!Array.isArray(firmajson))
        {
            firmajson = [];
        }
        firmajson.push(yeniFirma);
        firmajson.sort((a, b) => a.fi.localeCompare(b.fi, 'tr'));
        store.set('firmajson', firmajson);
        $('#HiddenField1').val(JSON.stringify(firmajson));
        return true;
    }
    catch (e)
    {
        alertify.error("Beklenmedik bir hata oluştu: " + e.message);
        return false;
    }
}
function metinuret(karaktersayisi)
{
    const harfler = "abcdefghijklmnopqrstuvwxyz0123456789";
    let sifre = "";
    for (let i = 0; i < karaktersayisi; i++)
    {
        const rastgeleIndex = Math.floor(Math.random() * harfler.length);
        sifre += harfler[rastgeleIndex];
    }
    return sifre;
}
function basharfbuyuk(e){let t=e.value;t=t.replace(/\s+/g," ").trim().replace(/[^\p{L} ',.()\/-_]/gu,"");if(!t.trim()){e.value="";return}let n=t.toLocaleLowerCase("tr-TR").split(" ").map(e=>e.charAt(0).toLocaleUpperCase("tr-TR")+e.slice(1)).join(" ").replace(/ Ve /g," ve ");e.value=n}
function tekbosluk(e) { let t = e.value; t = t.replace(/\s+/g, " ").trim(); e.value = t }
function adsoyadduzelt(e){let t=e.value;t=t.replace(/\s+/g," ").trim(),t=t.replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]/g,"");if(!t.trim()){e.value="";return}let l=t.split(/(\s+)/),a=l.length-1;for(;a>=0&&""===l[a].trim();)a--;if(a<0){e.value=t;return}l[a]=l[a].toLocaleUpperCase("tr-TR");for(let t=0;t<a;t++)""!==l[t].trim()&&(l[t]=l[t].charAt(0).toLocaleUpperCase("tr-TR")+l[t].slice(1).toLocaleLowerCase("tr-TR"));e.value=l.join("")}
function rakamvenokta(i){i.value=i.value.replace(/[^0-9.]/g,"").trim()}
function firmajsonokuma()
{
    let firmajson = store.get('firmajson');
    if (typeof firmajson === "string")
    {
        try
        {
            firmajson = JSON.parse(firmajson);
        }
        catch
        {
            alertify.error("Firma verisi okunamadı");
            firmajson = [];
        }
    }
    else if (!Array.isArray(firmajson))
    {
        firmajson = [];
    }
    return firmajson;
}

function isyeriduzenlemeload()
{
    isyeriyeniload();
    const link = new URLSearchParams(window.location.search);
    const id = link.get('id');
    let firmajson = firmajsonokuma();
    firmajson = firmajson.find(item => item.id === id);
    if (firmajson)
    {
        $("#fi").val(firmajson.fi || "");
        $("#is").val(firmajson.is || "");
        $("#sh").val(firmajson.sh || "");
        $("#ts").val(String(firmajson.ts) || "");
        let hkAd = firmajson.hk || "";
        $("#hk option").each(function(){let t=$(this).val();if(t.startsWith(hkAd+"|")){$("#hk").val(t);return false}});
        $("#fk").val(firmajson.fk || "");
        $("#sc").val(firmajson.sc || "");
        $("#ad").val(firmajson.ad || "");
    }
    else
    {
        alertify.error('Beklenmedik bir hata oluştu');
    }
}
function isyeriduzenlemetamam()
{
    const link = new URLSearchParams(window.location.search);
    const id = link.get('id');
    if (id.length !== 10)
    {
        window.location.href = "isyerilistesi.aspx";
        return false;
    }
    let firmajson = firmajsonokuma();
    if (!Array.isArray(firmajson) || firmajson.length === 0)
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
    let fi = $('#fi').val().trim();
    let isv = $('#is').val().trim();
    let sh = $('#sh').val();
    let tehlikesinifimap = new Map([["Az Tehlikeli",1],["Tehlikeli",2],["Çok Tehlikeli",3]]);
    let tssecim = $("#ts option:selected").text();
    let ts = tehlikesinifimap.get(tssecim) || 0;
    if (!fi || !isv || !sh || ts === 0)
    {
        alertify.error("Zorunlu alanları doldurunuz.");
        return false;
    }
    let guncelVeri = { id: id, fi: $("#fi").val().trim(), fk: $("#fk").val().trim(), is: $("#is").val().trim(), ad: $("#ad").val().trim(), ts: $("#ts").val(), sh: $("#sh").val().trim(), sc: $("#sc").val().trim(), hk: "", hn: "" };
    let hkVal = $("#hk").val();
    if(hkVal.includes("|")){let p=hkVal.split("|");guncelVeri.hk=p[0].trim();guncelVeri.hn=p[1].trim();}
    let index = firmajson.findIndex(f => f.id === id);
    if (index !== -1)
    {
        firmajson[index] = guncelVeri;
        store.set("firmajson", firmajson);
        $('#HiddenField1').val(JSON.stringify(firmajson));
        return true;
    }
    else
    {
        alertify.error("Firma bulunamadı.");
        return false;
    }    
}

function isyerisilmeload()
{
    let firmajson = firmajsonokuma();
    if (firmajson && Array.isArray(firmajson))
    {
        $('#isyeritablo').DataTable({
            data: firmajson,
            columns:
            [
                { data: 'fi', title: 'Firma İsmi' },
                { data: 'fk', title: 'Kısa İsim' },
                { data:'id',title:'Seç',orderable:false,render:function(d){return `<input type="button" class="cssbutontamam" value="Sil" onclick="idoku('${d}')" />`}}
            ],
            pageLength: 10,
            lengthMenu: [ [10, 50, 100, 500, -1], ['10', '50', '100', '500', 'Tümü'] ],
            order: [[0, 'asc']],
            language:{search:"İşyeri Ara:",lengthMenu: "Sayfa başına _MENU_ kayıt göster",zeroRecords:"Eşleşen kayıt bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Kayıt yok",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Kayıtlı işyeri bulunamadı"},
            createdRow: function (row)
            {
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
            },
            headerCallback: function (thead){$(thead).find('th').css('text-align', 'center');}
        });
    }
    else
    {
        alertify.error("Beklenmedik bir hata oluştu");
    }
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
}
function idoku(id)
{
    store.set("isyerisilmeid", id);
    $("#isyersil").fadeIn();
}
function isyerisilmeonay()
{
    $('#isyersil').fadeOut();
    let id = store.get("isyerisilmeid");
    let firmajson = firmajsonokuma();
    try 
    {
        firmajson = firmajson.filter(firmajson => firmajson.id != id); 
        store.set('firmajson', firmajson);
        $('#HiddenField1').val(JSON.stringify(firmajson));
        $('#HiddenField2').val(id);
        return true;
    }
    catch
    {
        alertify.error("Beklenmedik bir hata oluştu");
        return false;
    }
}

function isyerisecimload()
{
    const dropdown = $('#isyeri');
    dropdown.empty();
    dropdown.append($('<option>', { text: 'Lütfen işyerini seçiniz', value: '', disabled: true, selected: true }));
    let firmajson = firmajsonokuma();
    if (firmajson.length > 0)
    {
        firmajson.sort((a, b) => a.fk.localeCompare(b.fk, 'tr', { sensitivity: 'base' }));
        $.each(firmajson, function (_, row) { dropdown.append($('<option>', { text: row.fk, value: row.id }));});
    }
    else
    {
        alertify.error("Kayıtlı işyeri bulunamadı");
    }
    dropdown.select2({ placeholder: "Lütfen işyerini seçiniz", theme: "classic",  allowClear: true, language: { noResults: function () { return "Sonuç bulunamadı";}}});
    const link = new URLSearchParams(window.location.search);
    const secim = link.get("id");
    if (secim === '01')
    {
        $("#baslik").text("ÇALIŞAN EKLEME DÜZENLEME VE SİLME - İŞYERİ SEÇİM");
    } 
    else if (secim === '02')
    {
        $("#baslik").text("EXCEL İLE ÇALIŞAN EKLEME DÜZENLEME ve SİLME - İŞYERİ SEÇİM");
    } 
    else if (secim === '03')
    {
        $("#baslik").text("ACİL DURUM EKİBİ GÖREVLENDİRME - İŞYERİ SEÇİM");
    } 
    else if (secim === '04')
    {
        $("#baslik").text("ÇALIŞAN TEMSİLCİSİ GÖREVLENDİRME - İŞYERİ SEÇİM");
    } 
    else if (secim === '05')
    {
        $("#baslik").text("RİSK DEĞERLENDİRME EKİBİ GÖREVLENDİRME - İŞYERİ SEÇİM");
    } 
    else if (secim === '06')
    {
        $("#baslik").text("İŞ SAĞLIĞI ve GÜVENLİĞİ KURULU ÜYELERİ - İŞYERİ SEÇİM");
    } 
    else if (secim === '07' || secim === '08')
    {
        $("#baslik").text("EVRAK KAYIT - İŞYERİ SEÇİM");
    } 
    else if (secim === '09')
    {
        $("#baslik").text("RAPORLAMA - İŞYERİ SEÇİM");
    } 
}


function isyerisecimtamam()
{
    let firmajson = firmajsonokuma(); 
    const firmaid = $('#isyeri').val();
    if (!firmaid)
    {
        console.log("Henüz bir seçim yapılmadı.");
        return;
    }
    firmajson = firmajson.find(f => f.id == firmaid);
    store.set('xjsonfirma', firmajson);
    store.set('xfirmaid', firmajson.id);
    const link = new URLSearchParams(window.location.search);
    const secim = link.get("id");
    if (secim === '01')
    {
        window.location.href = "calisangenelliste.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '02')
    {
        window.location.href = "calisanexcelleduzenle1.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '03')
    {
        window.location.href = "gorevlendirmeacildurum.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '04')
    {
        window.location.href = "gorevlendirmecalisantemsilcisi.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '05')
    {
        window.location.href = "gorevlendirmeriskanaliziekip.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '06')
    {
        window.location.href = "gorevlendirmekurul.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '07')
    {
        window.location.href = "evrakkayitcalisan.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '08')
    {
        window.location.href = "evrakkayitisyeriyeni.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
    if (secim === '09')
    {
        window.location.href = "raporlama.aspx?id=" + encodeURIComponent(firmajson.id);
    }    
}

function calisangenellisteload()
{
    var json = calisangetir();
    if (json.length === 0)
    {
        return;
    }
    $('#tablo').DataTable
    ({
        data: json,
        columns:
        [
            { title:"Ad", data:"ad" },
            { title:"Unvan", data: "un" },
            { title: "Düzenle", data: "id", orderable: false, searchable: false, render: function (d) { return '<input type="button" class="cssbutontamam" value="Düzenle" onclick="calisanduzenlegoster(\'' + d + '\')">'; } },
            { title: "Sil", data: "id", orderable: false, searchable: false, render: function (d) { return '<input type="button" class="cssbutontamam" value="Sil" onclick="calisansilgoster(\'' + d + '\')">'; } }
        ],
        language:{search:"Çalışan Ara:",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Böyle bir çalışan bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Kayıt yok",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Kayıtlı çalışan bulunamadı"},
        createdRow: function (row)
        {
            $(row).find('td').eq(0).css('text-align', 'left');
            $(row).find('td').eq(1).css('text-align', 'left');
            $(row).find('td').eq(2).css('text-align', 'center');
            $(row).find('td').eq(3).css('text-align', 'center');
        },
        headerCallback: function(thead) { $(thead).find('th').css('text-align', 'center');}
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
}

function calisangetir()
{
    let json = $('#HiddenField1').val();
    try
    {
        json = JSON.parse(json);
    }
    catch
    {
        json = [];
    }
    return json;
}
function calisanduzenlegoster(id)
{
    var json = calisangetir();
    json = json.find(r => r.id == id);
    if (json)
    {
        $('#adsoyad2').val(json.ad);
        $('#unvan2').val(json.un);
        store.set("calisanid", id);
        $('#diyalogduzenle').fadeIn();
    }
}
function calisanjsonguncelle()
{
    let data = calisangetir();
    var calisanid = store.get("calisanid");
    var calisanad = $('#adsoyad2').val().trim();
    var unvan = $('#unvan2').val().trim();
    if (!calisanad)
    {
        alertify.error("Ad Soyad boş olamaz.");
        return false;
    }
    var kontrol = false;
    for (var i = 0; i < data.length; i++)
    {
        if (data[i].id == calisanid)
        {
            data[i].ad = calisanad;
            data[i].un = unvan;
            kontrol = true;
            break;
        }
    }
    if (kontrol === false)
    {
        alertify.error("Güncellenecek çalışan bulunamadı.");
        return false;
    }
    data = calisansiralama(data);
    $('#HiddenField1').val(JSON.stringify(data));
    $('#diyalogduzenle').fadeOut();
    return true;
}
function gostercalisanekle()
{
    $('#adsoyad1').val('');
    $('#unvan1').val('');
    $('#diyalogekle').fadeIn();
}
function calisanjsonekle()
{
    let json = calisangetir();
    var calisanad = $('#adsoyad1').val().trim();
    var calisanunvan = $('#unvan1').val().trim();
    if (!calisanad)
    {
        alertify.error("Ad Soyad boş olamaz.");
        return false;
    }
    var yenicalisan={id:metinuret(3),ad:calisanad,un:calisanunvan,a:0,t:0,r:0,e:"",s:"",i:""};
    json.push(yenicalisan);
    json = calisansiralama(json);
    $('#HiddenField1').val(JSON.stringify(json));
    $('#diyalogekle').fadeOut();
    return true;
}
function calisansilgoster(id)
{
    var json = calisangetir();
    json = json.find(r => r.id == id);
    if (json)
    {
        $('#silbilgi').text(json.ad + " adlı çalışanı silmek istediğinizden emin misiniz ?");
        store.set("calisanid", id);
        $('#diyalogsil').fadeIn();
    }
}
function calisanjsonsil()
{
    try
    {
        let json = calisangetir();
        var calisanid = store.get("calisanid");
        json = json.filter(r => r.id != calisanid);
        json = calisansiralama(json);
        $('#HiddenField1').val(JSON.stringify(json));
        $('#diyalogsil').fadeOut();
        return true;
    }
    catch
    {
        $('#diyalogsil').fadeOut();
        alertify.error("Çalışan silinemedi");
        return false;
    }
}
function calisansiralama(json)
{
    if (typeof json === "string")
    {
        json = JSON.parse(json);
    }
    return json.sort((a, b) => a.ad.localeCompare(b.ad, 'tr-TR', { sensitivity: 'base' }));
}

function calisanlistepdfyaz()
{
    let dosyaid = metinuret(3);
    let json = calisangetir();
    json = calisansiralama(json);
    const icerik =
    [
        [{ text: 'No', style: 'header' }, { text: 'Çalışan Ad Soyad', style: 'header' }, { text: 'Çalışan Unvan', style: 'header' }],
        ...json.map((x,i)=>[{text:i+1,alignment:'center'},x.ad,x.un])
    ];
    const dokuman =
    {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content:[{table:{headerRows:1,widths:['7%','46%','47%'],body:icerik},layout:'solid'}],
        styles:{header:{fontSize:12,bold:true,alignment:'center'}},
    };
    pdfMake.createPdf(dokuman).download('Çalışan Listesi - ' + dosyaid + '.pdf');
}

function adsoyadstring(s){let t=s.replace(/\s+/g," ").trim().replace(/[^a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]/g,"");if(!t.trim())return"";let p=t.split(/(\s+)/),l=p.length-1;while(l>=0&&p[l].trim()==="")l--;if(l<0)return t;p[l]=p[l].toLocaleUpperCase("tr-TR");for(let i=0;i<l;i++)p[i].trim()!==""&&(p[i]=p[i].charAt(0).toLocaleUpperCase("tr-TR")+p[i].slice(1).toLocaleLowerCase("tr-TR"));return p.join("")}
function basharfstring(s){let t=s.replace(/\s+/g," ").trim().replace(/[^\p{L} ',.()\/-_]/gu,"");if(!t.trim())return"";return t.toLocaleLowerCase("tr-TR").split(" ").map(w=>w.charAt(0).toLocaleUpperCase("tr-TR")+w.slice(1)).join(" ").replace(/ Ve /g," ve")}

function isyerilistesiload()
{
    let firmajson = firmajsonokuma();
    if (firmajson && Array.isArray(firmajson))
    {
        $('#isyeritablo').DataTable({
            data: firmajson,
            columns:
            [
                { data: 'fi', title: 'Firma İsmi' },
                { data: 'fk', title: 'Kısa İsim' },
                { data: 'id', title: 'Seç', orderable: !1, render: e => `<input type="button" name="duzenle" class="cssbutontamam" value="Düzenle" data-id="${e}"/>` }
            ],
            pageLength: 10,
            lengthMenu: [ [10, 50, 100, 500, -1], ['10', '50', '100', '500', 'Tümü'] ],
            order: [[0, 'asc']],
            language:{search:"İşyeri Ara:",lengthMenu: "Sayfa başına _MENU_ kayıt göster",zeroRecords:"Eşleşen kayıt bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Kayıt yok",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Kayıtlı işyeri bulunamadı"},
            createdRow: function (row)
            {
                $(row).find('td').eq(0).css('text-align', 'left');
                $(row).find('td').eq(1).css('text-align', 'left');
            },
            headerCallback: function (thead){$(thead).find('th').css('text-align', 'center');}
        });
    }
    else
    {
        alertify.error("Beklenmedik bir hata oluştu");
    }
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $('#isyeritablo tbody').on('click', 'input[name="duzenle"]',function(){
        let id = $(this).data('id');
        window.location.href = "isyeriduzenleme.aspx?id=" + encodeURIComponent(id);
    });
}

function sifredegistirmedogrulama()
{
    var eski = $("#eskisifre").val().trim();
    var yeni = $("#yenisifre").val().trim();
    var tekrar = $("#tekrarsifre").val().trim();
    if (eski === "")
    {
        mesaj("Eski şifre alanı boş bırakılamaz.");
        return false;
    }
    if (yeni === "")
    {
        mesaj("Yeni şifre alanı boş bırakılamaz.");
        return false;
    }
    if (tekrar === "") {
        mesaj("Yeni şifre tekrar alanı boş bırakılamaz.");
        return false;
    }
    if (yeni.length < 6)
    {
        mesaj("Yeni şifre en az 6 karakter olmalıdır.");
        return false;
    }
    if (yeni !== tekrar)
    {
        mesaj("Yeni şifre ile tekrarı aynı değil.");
        return false;
    }
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    var turkceKarakter = /[çğıöşüÇĞİÖŞÜ]/;
    if (!regex.test(yeni) || turkceKarakter.test(yeni))
    {
        mesaj("Şifreniz en az 6 karakter olmalı, büyük/küçük harf ve rakam içermeli, Özel/Türkçe karakter içermemelidir.");
        return false;
    }
    $('#HiddenField1').val(eski);
    $('#HiddenField2').val(yeni);
}

function mesaj(text)
{
    alertify.error(text);
}


function hekimtanimlamaload()
{
    let json = $('#HiddenField1').val();
    data = calisansiralama(json);
    var table = $('#kisitablo').DataTable
    ({
        data: data,
        dom: 't',
        ordering: false,
        columns:
        [
            {title: "Ad Soyad", data: "ad", width: "50%", orderable: false },
            {title: "Belge No", data: "no", width: "30%", orderable: false },
            {title:"Düzenle",data:null,orderable:false,width:"10%",render:function(d,t,r,m){return'<input type="button" name="duzenle" class="cssbutontamam" value="Düzenle" data-id="'+r.id+'" data-ad="'+r.ad+'" data-no="'+r.no+'">';}},
            {title:"Sil",data:null,orderable:false,width:"10%",render:function(d,t,r,m){return'<input type="button" name="sil" class="cssbutontamam" value="Sil" data-id="'+r.id+'" data-ad="'+r.ad+'" data-no="'+r.no+'">';}}
        ],
        language:{zeroRecords:"Eşleşen kayıt bulunamadı",infoEmpty:"Kayıtlı hekim bulunamadı",emptyTable:"Kayıtlı hekim bulunamadı"},
        createdRow:function(row){$(row).find("td").eq(0).css("text-align","left");$(row).find("td").eq(1).css("text-align","center");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');},
    });
    $('.dt-search input').css({"background-color": "white",}).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white", });
    $('#kisitablo tbody').on('click', 'input[name="sil"]', function ()
    {
        $('#dylghekimsil').fadeIn();
        var $row = $(this).closest('tr');
        var rowData = table.row($row).data();
        if (rowData)
        {
            $('#silbilgi').html(`${rowData.ad} adlı hekimi (${rowData.no}) SİLMEK istediğinizden emin misiniz ?`);
            store.set("hekimid", rowData.id);
            store.set("hekimad", rowData.ad);
            store.set("hekimno", rowData.no);
        }
    });
    $('#kisitablo tbody').on('click', 'input[name="duzenle"]', function ()
    {
        var $row = $(this).closest('tr');
        var rowData = table.row($row).data();
        if (rowData)
        {
            $('#adsoyad2').val(rowData.ad);
            $('#no2').val(rowData.no);
            store.set("hekimid", rowData.id);
            store.set("hekimad", rowData.ad);
            store.set("hekimno", rowData.no);
            $('#dylghekimduzenle').fadeIn();
        }
    });
}
function hekimtanimekle()
{
    let ad = $('#adsoyad1').val().trim();
    let no = $('#no1').val().trim();
    if (!ad || !no)
    {
        alertify.error("Lütfen tüm alanları doldurunuz.");
        return false;
    }
    let json = $('#HiddenField1').val();
    data = calisansiralama(json);
    let yeni = { id: metinuret(3), ad: ad, no: no};
    data.push(yeni);
    data.sort((a, b) => a.ad.localeCompare(b.ad, 'tr-TR', { sensitivity: 'base' }));
    $('#HiddenField1').val(JSON.stringify(data));
    $('#dylghekimekle').fadeOut();
}

function hekimtanimguncelle()
{
    let ad = $('#adsoyad2').val().trim();
    let no = $('#no2').val().trim();
    let secilen = store.get("hekimid");
    if (!ad || !no || !secilen)
    {
        alertify.error("Lütfen bir hekim seçip tüm alanları doldurunuz.");
        return false;
    }
    let json = $('#HiddenField1').val();
    data = calisansiralama(json);
    let index = data.findIndex(x => x.id === secilen);
    if (index >= 0)
    {
        data[index].ad = ad;
        data[index].no = no;
        data = calisansiralama(data);
        $('#HiddenField1').val(JSON.stringify(data));
        let hekimad = store.get("hekimad");
        let hekimno = store.get("hekimno");
        data = [];
        data = firmajsonokuma();
        for (let i = 0; i < data.length; i++)
        {
            if (data[i].hk === hekimad || data[i].hn === hekimno)
            {
                data[i].hk = ad;
                data[i].hn = no;
            }
        }
        store.set("firmajson", data);
        $('#HiddenField2').val(JSON.stringify(data));
        $('#dylghekimduzenle').fadeOut();
    }
    else
    {
        alertify.error("Güncellenecek kayıt bulunamadı.");
        return false;
    }
}
function hekimtanimsil()
{
    let secilen = store.get("hekimid");
    if (!secilen)
    {
        alertify.error("Lütfen bir hekim seçiniz.");
        return false;
    }
    let json = $('#HiddenField1').val();
    data = calisansiralama(json);
    let ad = "";
    let no = "";
    let silinen = data.find(x => x.id === secilen);
    if (silinen)
    {
        ad = silinen.ad || "";
        no = silinen.no || "";
    }
    let yenidata = data.filter(x => x.id !== secilen);
    yenidata.sort((a, b) => a.ad.localeCompare(b.ad, 'tr-TR', { sensitivity: 'base' }));
    $('#HiddenField1').val(JSON.stringify(yenidata));
    data = [];
    data = firmajsonokuma();

    for (let i = 0; i < data.length; i++)
    {
        if (data[i].hk === ad || data[i].hn === no)
        {
            data[i].hk = "";
            data[i].hn = "";
        }
    }
    store.set('firmajson', data);
    $('#HiddenField2').val(JSON.stringify(data));
    $('#dylghekimsil').fadeOut();
}

function gorevlendirmeacildurumload()
{
    const ekipliste={0:"Görevli Değil",1:"İlkyardım Ekibi - Ekip Başı",2:"İlkyardım Ekibi - Ekip Personeli",3:"Söndürme Ekibi - Ekip Başı",4:"Söndürme Ekibi - Ekip Personeli",5:"Koruma Ekibi - Ekip Başı + Koordinasyon",6:"Koruma Ekibi - Ekip Personeli + Koordinasyon",7:"Koruma Ekibi - Ekip Personeli",8:"Kurtarma Ekibi - Ekip Başı",9:"Kurtarma Ekibi - Ekip Personeli",10:"Destek Elemanı"};
    let calisanjson = calisangetir();
    $('#tablo').DataTable
    ({
        data: calisanjson,
        columns:
        [
            { data: 'ad', title: 'Ad Soyad' },
            { data: 'un', title: 'Unvan' },
            { data:"a",title:"Acil Durum Görevi",render:function(d){const k=parseInt(d);return typeof ekipliste[k]!=="undefined"?ekipliste[k]:"Bilinmiyor"}},
            { data:null,title:"Görevlendirme",orderable:false,render:function(){return'<input type="button" name="sec" class="cssbutontamam" value="Seç"/>'}}
        ],
        order: [[0, 'asc']],
        pageLength: 500,
        lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
        columnDefs: [{ orderable: false, targets: '_all' }],
        language:{search:"Çalışan Ara: ",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Çalışan bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Çalışan bulunamadı",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Kayıtlı çalışan bulunamadı"},
        createdRow:function(row){$(row).find("td").eq(0).css("text-align","left");$(row).find("td").eq(1).css("text-align","left");$(row).find("td").eq(2).css("text-align","center");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
    $('#tablo').on('click', 'input[name="sec"]', function()
    {
        const veri = $('#tablo').DataTable().row($(this).closest('tr')).data();
        store.set('acildurumsecim', veri);
        const mevcutGorev = veri.a ? parseInt(veri.a) : 0;
        $('#gorevselect').val(mevcutGorev);
        $('#dylgacildurum').fadeIn();
    });
}

function gorevlendirmeacildurumguncelle()
{
    const secilen = store.get('acildurumsecim');
    if (!secilen || !secilen.id)
    {
        alertify.error("Seçilen personel bulunamadı.");
        return;
    }
    const yeniGorev = parseInt($('#gorevselect').val());
    let calisanlar = calisangetir();
    const index = calisanlar.findIndex(x => x.id === secilen.id);
    if (index !== -1)
    {
        calisanlar[index].a = yeniGorev;
    }
    else
    {
        console.warn("Seçilen personel JSON içinde bulunamadı.");
        return;
    }
    $('#HiddenField1').val(JSON.stringify(calisanlar));
    const tablo = $('#tablo').DataTable();
    const rowIndex = tablo.rows().eq(0).filter(function (i)
    {
        return tablo.row(i).data().id === secilen.id;
    });
    if (rowIndex.length > 0)
    {
        const rowData = tablo.row(rowIndex[0]).data();
        rowData.a = yeniGorev;
        tablo.row(rowIndex[0]).data(rowData).invalidate();
    }
    $('#dylgacildurum').fadeOut();
}

function gorevlendirmeacildurumpdf()
{
    const ekipliste={0:"Görevli Değil",1:"İlkyardım Ekibi - Ekip Başı",2:"İlkyardım Ekibi - Ekip Personeli",3:"Söndürme Ekibi - Ekip Başı",4:"Söndürme Ekibi - Ekip Personeli",5:"Koruma Ekibi - Ekip Başı + Koordinasyon",6:"Koruma Ekibi - Ekip Personeli + Koordinasyon",7:"Koruma Ekibi - Ekip Personeli",8:"Kurtarma Ekibi - Ekip Başı",9:"Kurtarma Ekibi - Ekip Personeli",10:"Destek Elemanı"};
    let json = calisangetir();
    if (!json || json.length === 0) { alertify.error("Görevli çalışan bulunamadı"); return false; }
    json = json.filter(x => x.a !== 0);
    if (!json || json.length === 0) { alertify.error("Görevli çalışan bulunamadı"); return false; }
    json.sort((a,b)=>a.a-b.a);
    let dosyaid = metinuret(3);
    const icerik =
    [
        [
            { text: 'No', style: 'header' },
            { text: 'Çalışan Ad Soyad', style: 'header' },
            { text: 'Acil Durum Ekip Görevi', style: 'header' }
        ],
        ...json.map((x,i)=>[{text:i+1,alignment:'center'},x.ad,ekipliste[x.a]||"Bilinmiyor"])
    ];
    const dokuman =
    {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content:
        [{
            table:
            {
                headerRows:1,
                widths:['7%','36%','57%'],
                body:icerik
            },
            layout:'solid'
        }],
        styles:{ header:{fontSize:12,bold:true,alignment:'center'}},
    };
    pdfMake.createPdf(dokuman).download('Acil Durum Ekibi - ' + dosyaid + '.pdf');
}

function gorevlendirmecalisanload()
{
    const ekipliste={0:"Görevli Değil",1:"Çalışan Temsilcisi",2:"Çalışan Baş Temsilcisi"};
    let calisanjson = calisangetir();
    const table = $('#tablo').DataTable
    ({
        data: calisanjson,
        columns:
        [
            { data: 'ad', title: 'Ad Soyad' },
            { data: 'un', title: 'Unvan' },
            { data:'t', title:'Çalışan Temsilcisi',render:d=>ekipliste[parseInt(d)]||'Bilinmiyor'},
            { data:null, title:'Görevlendirme',orderable:false,render:()=>'<input name="sec" type="button" class="cssbutontamam" value="Seç"/>'}
        ],
        order: [[0, 'asc']],
        pageLength: 500,
        lengthMenu: [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
        columnDefs: [{ orderable: false, targets: '_all' }],
        language:{search:"Çalışan Ara: ",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Çalışan bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Çalışan bulunamadı",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Kayıtlı çalışan bulunamadı"},
        createdRow:function(row){$(row).find("td").eq(0).css("text-align","left");$(row).find("td").eq(1).css("text-align","left");$(row).find("td").eq(2).css("text-align","center");},
        headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
    });
    $('#tablo').off('click', 'input[name="sec"]').on('click', 'input[name="sec"]', function ()
    {
        const veri = table.row($(this).closest('tr')).data();
        store.set('temsilcisecim', veri);
        const mevcutGorev = veri.t ? parseInt(veri.t) : 0;
        $('#gorevselect').val(mevcutGorev);
        $('#dylgcalisantemsilcisi').fadeIn();
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
}

function gorevlendirmetemsilciguncelle()
{
    const secilen = store.get('temsilcisecim');
    if (!secilen || !secilen.id)
    {
        alertify.error("Seçilen çalışan bulunamadı.");
        return;
    }
    const yeniGorev = parseInt($('#gorevselect').val());
    let calisanlar = calisangetir();
    const index = calisanlar.findIndex(x => x.id === secilen.id);
    if (index !== -1)
    {
        calisanlar[index].t = yeniGorev;
    }
    else
    {
        alertify.error("Seçilen çalışan bulunamadı.");
        return;
    }
    $('#HiddenField1').val(JSON.stringify(calisanlar));
    const tablo = $('#tablo').DataTable();
    const rowIndex = tablo.rows().eq(0).filter(function (i)
    {
        return tablo.row(i).data().id === secilen.id;
    });
    if (rowIndex.length > 0)
    {
        const rowData = tablo.row(rowIndex[0]).data();
        rowData.t = yeniGorev;
        tablo.row(rowIndex[0]).data(rowData).invalidate();
    }
    $('#dylgcalisantemsilcisi').fadeOut();
}



function gorevlendirmetemsilcipdf()
{
    const ekipliste={0:"Görevli Değil",1:"Çalışan Temsilcisi",2:"Çalışan Baş Temsilcisi"};
    let json = calisangetir();
    if (!json || json.length === 0) { alertify.error("Görevli çalışan bulunamadı"); return false; }
    json = json.filter(x => x.t !== 0);
    if (!json || json.length === 0) { alertify.error("Görevli temsilci bulunamadı"); return false; }
    json.sort((a,b) => b.t - a.t); 
    let dosyaid = metinuret(3);
    const icerik =
    [
        [
            { text: 'No', style: 'header' },
            { text: 'Çalışan Ad Soyad', style: 'header' },
            { text: 'Temsilci Görevi', style: 'header' }
        ],
        ...json.map((x,i)=>[{text:i+1,alignment:'center'},x.ad,ekipliste[x.t]||"Bilinmiyor"])
    ];
    const dokuman =
    {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content:
        [{
            table:
            {
                headerRows:1,
                widths:['7%','36%','57%'],
                body:icerik
            },
            layout:'solid'
        }],
        styles:{ header:{fontSize:12,bold:true,alignment:'center'}},
    };
    pdfMake.createPdf(dokuman).download('Çalışan Temsilcisi - ' + dosyaid + '.pdf');
}


function excelleduzenleload2()
{
    let mysqljson = store.get('mysqljson');
    mysqljson = mysqljson ? JSON.parse(mysqljson) : [];
    $('#HiddenField1').val(JSON.stringify(mysqljson));
    const ekleData = JSON.parse(store.get('eklejson') || "[]");
    const silData = JSON.parse(store.get('siljson') || "[]");
    const guncelleData = JSON.parse(store.get('gunceljson') || "[]");
    function tabloOlustur(tabloId, data)
    {
        $(`#${tabloId}`).DataTable
        ({
            destroy: true,
            data: data,
            order: [[0, 'asc']],
            dom: 't',
            language: {zeroRecords: "Bulunamadı", emptyTable: "Bulunamadı"},
            columns:
            [
                { data: 'ad', title: 'Ad Soyad', className: 'text-left' },
                { data: 'un', title: 'Unvan', className: 'text-left' }
            ],
            createdRow: function (row){$(row).find('td').eq(0).css('text-align', 'left'); $(row).find('td').eq(1).css('text-align', 'left');},
            headerCallback: function (thead) { $(thead).find('th').css('text-align', 'center');}
        });
    }
    tabloOlustur('ekletablo', ekleData);
    tabloOlustur('siltablo', silData);
    tabloOlustur('guncelletablo', guncelleData);
}

function excelleduzenleekle()
{
    const mysqljson = $('#HiddenField1').val();
    let mysqlData = mysqljson ? JSON.parse(mysqljson) : [];
    const eklejsonStr = store.get('eklejson');
    if (!eklejsonStr)
    {
        alertify.error("Eklenmek üzere çalışan bulunamadı.");
        return false;
    }
    const ekleData = JSON.parse(eklejsonStr);
    if (ekleData.length === 0)
    {
        alertify.warning("Yeni eklenecek çalışan bulunamadı.");
        return false;
    }
    const mevcutAdSet = new Set(mysqlData.map(x => x.ad));
    ekleData.forEach(c=>{if(!mevcutAdSet.has(c.ad)){mysqlData.push({ad:c.ad,un:c.un,a:0,t:0,r:0,e:"",s:"",i:"",id:metinuret(3)});mevcutAdSet.add(c.ad)}});
    mysqlData = calisansiralama(mysqlData);
    store.set('mysqljson', JSON.stringify(mysqlData));
    $('#HiddenField1').val(JSON.stringify(mysqlData));
    store.set('eklejson', '[]');
    $('#ekletablo').DataTable().clear().draw();
}

function excelleduzenlesil()
{
    const mysqljson = $('#HiddenField1').val();
    let mysqlData = mysqljson ? JSON.parse(mysqljson) : [];
    const siljsonStr = store.get('siljson');
    if (!siljsonStr)
    {
        alertify.error("Silinecek çalışan bilgisi bulunamadı.");
        return false;
    }
    const silData = JSON.parse(siljsonStr);
    const silinecekler = silData.map(x => x.id);
    if (silinecekler.length === 0)
    {
        alertify.warning("Silinecek çalışan bulunamadı.");
        return false;
    }
    mysqlData = mysqlData.filter(calisan => !silinecekler.includes(calisan.id));
    mysqlData = calisansiralama(mysqlData);
    $('#HiddenField1').val(JSON.stringify(mysqlData));
    store.set('mysqljson', JSON.stringify(mysqlData));
    store.set('siljson', '[]');
    $('#siltablo').DataTable().clear().draw();
}

function excelleduzenleguncelleme()
{
    const mysqljson = $('#HiddenField1').val();
    let mysqlData = mysqljson ? JSON.parse(mysqljson) : [];
    const gunceljsonStr = store.get('gunceljson');
    if (!gunceljsonStr)
    {
        alertify.error("Güncellenecek çalışan bilgisi bulunamadı.");
        return false;
    }
    const guncelData = JSON.parse(gunceljsonStr);
    if (guncelData.length === 0)
    {
        alertify.warning("Güncellenecek çalışan bulunamadı.");
        return false;
    }
    const guncelleMap = new Map(guncelData.map(x => [x.id, x]));
    mysqlData=mysqlData.map(c=>guncelleMap.has(c.id)?{...c,ad:guncelleMap.get(c.id).ad,un:guncelleMap.get(c.id).un}:c);
    mysqlData = calisansiralama(mysqlData);
    store.set('mysqljson', JSON.stringify(mysqlData));
    $('#HiddenField1').val(JSON.stringify(mysqlData));
    store.set('gunceljson', '[]');
    $('#guncelletablo').DataTable().clear().draw();
}

function isyerigetir()
{
    const dropdown = $('#isyeri');
    dropdown.empty();
    dropdown.append($('<option>', { text: 'Lütfen işyerini seçiniz', value: '', disabled: true, selected: true }));
    let firmajson = firmajsonokuma();
    if (firmajson.length > 0)
    {
        firmajson.sort((a, b) => a.fk.localeCompare(b.fk, 'tr', { sensitivity: 'base' }));
        $.each(firmajson, function (_, row) { dropdown.append($('<option>', { text: row.fk, value: row.id }));});
    }
    else
    {
        alertify.error("Kayıtlı işyeri bulunamadı");
    }
    dropdown.select2({ placeholder: "Lütfen işyerini seçiniz", theme: "classic",  allowClear: true, language: { noResults: function () { return "Sonuç bulunamadı";}}});
}

function excelleduzenleload1()
{
    var $container = $('#excelveri');
    var containerWidth = $(window).width() * 0.8;
    excelwebayar($container, containerWidth, "0");
    $('#durum').on('change', function ()
    {
        let durum = $(this).val();
        excelwebayar($container, containerWidth, durum);
    });
}
function excelwebayar($container, containerWidth, durum)
{
    let options={tabs:false,toolbar:false,worksheets:[]};
    if (durum === "0")
    {
        options.worksheets.push
        ({
            minDimensions: [2, 500],
            columns: [
                { width: containerWidth / 3, title: 'Ad Soyad' },
                { width: containerWidth / 3, title: 'Unvan' }
            ]
        });
    }
    else if (durum === "1")
    {
        options.worksheets.push
        ({
            minDimensions: [3, 500],
            columns: [
                { width: containerWidth / 4, title: 'Ad' },
                { width: containerWidth / 4, title: 'Soyad' },
                { width: containerWidth / 4, title: 'Unvan' }
            ]
        });
    }
    $container.html("");
    var spreadsheetInstance = jspreadsheet($container[0], options);
    $container.css({width:'80%',margin:'0 auto'});
    $container.data('spreadsheetInstance', spreadsheetInstance);
}

function calisanexcelduzenletamam1()
{
    var $container = $('#excelveri');
    var spreadsheetInstance = $container.data('spreadsheetInstance');
    if (!spreadsheetInstance)
    {
        alert("Spreadsheet yüklenmedi veya instance bulunamadı!");
        return;
    }
    let durum = $('#durum').val();
    var rawData = spreadsheetInstance[0].getData();
    var excelveri = [];
    if (durum === "0")
    {
        excelveri=$.map(rawData,function(row){return{ad:row[0]?adsoyadstring(row[0].toString().trim()):"",un:row[1]?basharfstring(row[1].toString().trim()):""};}).filter(function(row){return row.ad!=="";});
    }
    else if (durum === "1")
    {
        excelveri=$.map(rawData,function(row){let adsoyad="";if(row[0]||row[1]){adsoyad=(row[0]?row[0].toString().trim():"")+" "+(row[1]?row[1].toString().trim():"");}return{ad:adsoyad?adsoyadstring(adsoyad.trim()):"",un:row[2]?basharfstring(row[2].toString().trim()):""};}).filter(function(row){return row.ad!=="";});
    }
    let mysqljson = $('#HiddenField1').val();
    mysqljson = mysqljson ? JSON.parse(mysqljson) : [];
    const sonjson = [];
    excelveri.forEach(e=>{const m=mysqljson.find(x=>x.ad===e.ad);if(!m){sonjson.push({ad:e.ad,un:e.un,sonuc:1});}});
    mysqljson.forEach(m=>{const e=excelveri.find(x=>x.ad===m.ad);if(e){sonjson.push({ad:e.ad,un:e.un,a:m.a,t:m.t,r:m.r,e:m.e,s:m.s,i:m.i,id:m.id,sonuc:2});}else{sonjson.push({ad:m.ad,un:m.un,id:m.id,sonuc:0});}});
    const eklejson = sonjson.filter(x => x.sonuc === 1);
    const siljson = sonjson.filter(x => x.sonuc === 0);
    const gunceljson = sonjson.filter(x => x.sonuc === 2);
    store.set('eklejson', JSON.stringify(eklejson));
    store.set('siljson', JSON.stringify(siljson));
    store.set('gunceljson', JSON.stringify(gunceljson));
    store.set('mysqljson', JSON.stringify(mysqljson));
    const link = new URLSearchParams(window.location.search);
    const firmaid = link.get('id');
    window.location.href = "calisanexcelleduzenle2.aspx?id=" + encodeURIComponent(firmaid);
}

function gorevlendirmeriskload()
{
    const urlParams = new URLSearchParams(window.location.search);
    const firmaid = urlParams.get('id');
    if (!firmaid)
    {
        window.location.href = "anasayfa.aspx";
        return false;
    }
    let isyerijson = firmajsonokuma();
    var firma = isyerijson.find(item => item.id === firmaid);
    if (!firma)
    {
        window.location.href = "anasayfa.aspx";
        return false;
    }
    var uzman = store.get('uzmanad') + ' - ' + store.get('uzmanno');
    if (uzman)
    {
        var $uzmanSelect = $('#uzman');
        $uzmanSelect.append($('<option>', { text: uzman }));
    }
    $('#hekim').append($('<option>', { text: firma.hk + ' - ' + firma.hn }));
    $('#isveren').append($('<option>', { text: firma.is }));
    let calisanjson = calisangetir();
    const dropdownlar = ['#DropDownList1', '#DropDownList2', '#DropDownList3'];
    dropdownlar.forEach(function(dropid){const $ddl=$(dropid);$ddl.empty();$ddl.append($('<option>',{text:'Görevli Değil',value:''}));$.each(calisanjson,function(i,calisan){$ddl.append($('<option>',{value:calisan.id,text:calisan.ad}))});});
    calisanjson.forEach(function(calisan){if(calisan.r==1){$('#DropDownList1').val(calisan.id);}else if(calisan.r==2){$('#DropDownList2').val(calisan.id);}else if(calisan.r==3){$('#DropDownList3').val(calisan.id);}});
    secimkontrolgorev();
}
function destekelemaniguncelle()
{
    let calisanjson = calisangetir();
    calisanjson.forEach(c=>{if(c.r==1)c.r=0;});
    const secilenId = $('#DropDownList1').val();
    if (secilenId)
    {
        const eslesenCalisan = calisanjson.find(c => c.id == secilenId);
        if (eslesenCalisan)
        {
            eslesenCalisan.r = 1;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
    $('#HiddenField1').val(JSON.stringify(calisanjson));    
    secimkontrolgorev();
    return true;
}
function temsilciguncelle()
{
    let calisanjson = calisangetir();
    calisanjson.forEach(c=>{if(c.r==2)c.r=0;});
    const secilenId = $('#DropDownList2').val();
    if (secilenId)
    {
        const eslesenCalisan = calisanjson.find(c => c.id == secilenId);
        if (eslesenCalisan)
        {
            eslesenCalisan.r = 2;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
    $('#HiddenField1').val(JSON.stringify(calisanjson));
    secimkontrolgorev();
    return true;
}
function bilgilicalisanguncelle()
{
    let calisanjson = calisangetir();
    calisanjson.forEach(c=>{if(c.r==3)c.r=0;});
    const secilenId = $('#DropDownList3').val();
    if (secilenId)
    {
        const eslesenCalisan = calisanjson.find(c => c.id == secilenId);
        if (eslesenCalisan) {
            eslesenCalisan.r = 3;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
    $('#HiddenField1').val(JSON.stringify(calisanjson));
    secimkontrolgorev();
    return true;
}
function secimkontrolgorev()
{
    let secilenler={DropDownList1:$('#DropDownList1').val(),DropDownList2:$('#DropDownList2').val(),DropDownList3:$('#DropDownList3').val()};
    ['#DropDownList1','#DropDownList2','#DropDownList3'].forEach(function(ddlId){$(ddlId+' option').prop('disabled',false);});
    Object.entries(secilenler).forEach(([ddlName,secilenId])=>{if(secilenId){['DropDownList1','DropDownList2','DropDownList3'].forEach(otherDDL=>{if(otherDDL!==ddlName){$(`#${otherDDL} option`).each(function(){if($(this).val()===secilenId){$(this).prop('disabled',true);}});}});}});
}
function riskdegerlendirmepdfyazdir()
{
    let calisanjson = calisangetir();
    calisanjson = calisanjson.filter(x => x.r !== 0);
    calisanjson = calisanjson.map(x=>({adsoyad:x.ad,unvan:x.un,gorev:x.r===1?"Destek Elemanı":x.r===2?"Çalışan Temsilcisi":x.r===3?"Bilgi Sahibi Çalışan":"Bilinmiyor"}));
    const tableBody=[[{text:"Ad Soyad",bold:!0,alignment:"center"},{text:"Unvan",bold:!0,alignment:"center"},{text:"Ekip Görevi",bold:!0,alignment:"center"}],...calisanjson.map(x=>[{text:x.adsoyad,alignment:"left"},{text:x.unvan,alignment:"left"},{text:x.gorev,alignment:"left"}])];
    const docDefinition =
    {
        content:
        [
            { text: 'Risk Değerlendirme Ekip Listesi', style: 'header' },
            {style:"tableExample",table:{headerRows:1,widths:["33%","42%","25%"],body:tableBody}}
        ],
        styles:
        {
            header:
            {
                fontSize: 16,
                bold: true,
                margin: [0, 0, 0, 5],
                alignment:"center"
            },
            tableExample:
            {
                margin: [0, 10, 0, 5]
            }
        }
    };
    pdfMake.createPdf(docDefinition).getBlob(blob=>saveAs(blob,"Risk Değerlendirme Ekibi - " + metinuret(2) + ".pdf"));
}


function kurulgorevlendirmeload()
{
    let unvanlar=["İSG Kurul Başkanı","İşveren Vekili","Çalışan Baş Temsilcisi","Çalışan Temsilcisi","İnsan Kaynakları","Mali İşler Sorumlusu","Muhasebe","Sivil Savunma Uzmanı","Formen","Ustabaşı","Usta","Alt İşveren Temsilcisi"];
    let jsonData = calisangetir();
    while (jsonData.length < 10)
    {
        jsonData.push({ a: '', u: '' });
    }
    $('#kurultablo').DataTable
    ({
        data: jsonData,
        dom: 't',
        ordering: false,
        columns:
        [
            {data:null,title:'No',render:function(d,t,r,m){return m.row+1;}},
            {data:'a',title:'Ad Soyad',render:function(d,t,r){return`<input type="text" value="${d}" class="csstextbox90">`;}},
            {data:'u',title:'Kurul Unvan',render:function(d,t,r){return`<input type="text" value="${d}" class="csstextbox90">`;}},
        ],
        createdRow: function (r) { $(r).find('td').eq(0).css('text-align', 'center'); },
        headerCallback: function (t) { $(t).find('th').css('text-align', 'center'); }
    });
    $('#unvantablo').DataTable
    ({
        data: unvanlar.map(u => [u, '']),
        dom: 't',
        ordering: false,
        columns:
        [
            {title:"Sık Kullanılan Unvanlar"},
            {title:"Kopyala",render:function(d,t,r){return`<input type="button" class="cssbutontamam" value="Kopyala" onclick="navigator.clipboard.writeText('${r[0]}').then(()=>alertify.error('${r[0]} Kopyalandı'))">`;}}
        ],
        createdRow:function(row){$(row).find('td').eq(0).css('text-align','left');},
        headerCallback:function(thead){$(thead).find('th').css('text-align','center');}
    });
}
function kurulgorevlendirmeyaz()
{
    const table = $('#kurultablo').DataTable();
    const data = [];
    table.rows().every(function ()
    {
        const row = this.node();
        const adInput = $(row).find('td:eq(1) input');
        const unvanInput = $(row).find('td:eq(2) input');
        let adsoyad = adInput.length > 0 ? adInput.val().trim() : '';
        let unvan = unvanInput.length > 0 ? unvanInput.val().trim() : '';
        unvan = basharfstring(unvan);
        adsoyad = adsoyadstring(adsoyad);
        if (adsoyad !== '' && unvan !== '')
        {
            data.push({ a: adsoyad, u: unvan });
        }
    });
    $('#HiddenField1').val(JSON.stringify(data));
}

function dokumancalisanload()
{
    let calisanjson = calisangetir();
    $('#tablo').DataTable
    ({
        data: calisanjson,
        order: [[1, 'asc']],
        columns:
        [
            { data:null,title:"Seç",render:(d,t,r)=>`<input type="checkbox" class="row-checkbox" data-id="${r.ad}|${r.un}">`,orderable:false},
            { data: "ad", title: "Ad Soyad" },
            { data: "un", title: "Unvan" },
        ],
        language:{search:"Çalışan Ara:",lengthMenu:"Sayfa başına _MENU_ kayıt göster",zeroRecords:"Çalışan bulunamadı",info:"_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",infoEmpty:"Çalışan bulunamadı",infoFiltered:"(toplam _MAX_ kayıttan filtrelendi)",emptyTable:"Çalışan bulunamadı"},
        createdRow:function(r){$(r).find("td").eq(1).css("text-align","left");$(r).find("td").eq(2).css("text-align","left");},
        headerCallback: function (thead) {$(thead).find('th').css('text-align', 'center');}
    });
    $('.dt-search input').css({ "background-color": "white" }).attr("autocomplete", "off");
    $('.dt-length select').css({ "background-color": "white" });
}

function dokumancalisansecim()
{
    var calisanjson = [];
    $('#tablo').DataTable().rows().nodes().to$().find('.row-checkbox:checked').each(function ()
    {
        var rowKey = $(this).data('id');
        if (rowKey)
        {
            var [adsoyad, unvan] = rowKey.split('|');
            calisanjson.push({ a: adsoyad, u: unvan });
        }
    });
    store.set("calisansecimjsonx", JSON.stringify(calisanjson));
    return calisanjson;
}
