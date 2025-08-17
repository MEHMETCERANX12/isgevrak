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
        calisanliste = [{ ad: "", un: "" }];
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
            { text: 'Katılımcı Adı Soyadı: ' + calisan.ad, style: 'normalsatir', margin: [90, 0, 0, 5] },
            { text: 'Katılımcının Görev Unvanı: ' + calisan.un, style: 'normalsatir', margin: [90, 0, 0, 5] },
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
function sertifikaarkaplan(sertifikapdfdosyasi) {
    sertifikapdfdosyasi.background = function (currentPage, pageSize) {
        return {
            image: 'data:image/png;base64,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z58/f/78+fPnz58/f/78+fPnz7/flz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+ff78ufP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz7/flz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+ff78ufPnz9//vz58+fPn/8I/g+ZawrpQW5YVAAAAaxta0JU+s7K/gB/vscAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHic7dG7EUBgEIXR/fvxKAEtoGiqWpFIbo05wRffO3MyInKYt1/WWovM/HpHP62P7+Oyv7Gd/Mvjz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+df78ufPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vz58+fPnz9//vzrffnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+/Pnz58+fP3/+9b78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58/f/78+fPnz58//3pf/vz58+fPnz9//vz58787uzr/C5lsCunVLdq2AAACv21rQlT6zsr+AH/F0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeJzt3F1O21AUhVEm1MIMClOATqHtbIBJFfUhTAm3qerKTePEThzs470evodI+UFnXUcRvrpXTdNcFej5bfOledt83fb4tvk29vVPPa/rvu+Qhn72pd43td15Dp1X6973fP41GuvfurfP3z7mX7d9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ICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTNiAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjItMDUtMjJUMDk6NDQ6NDBaPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjItMDUtMjJUMDk6NDU6NThaPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+A1p8dgAAIABJREFUeJzs3UFyHMl5huE/EbPS0vQ5FJxohRzWRjqDfQcSuwFo+hSmCXA3wB3kM4xXCi06pBldQ/TOSyO9aIAgSKCJ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AAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAAAAAgjgACAAAAAADEEUAAAAAAAIA4AggAAAAAABBHAAEAAAAAAOIIIAAAAAAAQBwBBAAAAAAAiCOAAAAAAAAAcQQQAAAA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AAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAABHgZjBAAAXo0lEQVTiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4AAgAAAAAAxBFAAAAAAACAOAIIAAAAAAAQRwABAAAAAADiCCAAAAAAAEAcAQQAAAAAAIgjgAAAAAAAAHEEEAAAAAAAII4A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',
            width: 790,
            height: 550,
            margin: [25, 25, 25, 25],
        };
    };
    return sertifikapdfdosyasi;
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
        calisanliste = Array.from({ length: 1 }, () => ({ ad: ""}));
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
            new TableCell({ width: { size: 88, type: WidthType.PERCENTAGE }, children: [new Paragraph({ indent: { left: 70, right: 70 }, children: [new TextRun({ text: calisan.ad || "", font: "Calibri", size: 22 })], alignment: AlignmentType.LEFT })], verticalAlign: VerticalAlign.CENTER })
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
    dropdown.append($('<option>', { text: 'Lütfen işyerini seçiniz', value: '', disabled: true, selected: true }));
    let firmajson = firmajsonokuma();
    if (firmajson.length > 0)
    {
        firmajson.sort((a, b) => a.fk.localeCompare(b.fk, 'tr', { sensitivity: 'base' }));
        $.each(firmajson,function(_,row){dropdown.append($('<option>',{text:row.fk,value:row.id}));});
    }
    else
    {
        alertify.error("Kayıtlı işyeri bulunamadı");
    }
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

function calisanexcelduzenleload()
{
    const data = Array(500).fill(null).map(() => Array(2).fill(""));
    const container = $("#excel")[0];   
    let excel = new Handsontable(container,
    {
        data: data,
        colHeaders: ["Ad Soyad", "Unvan"],
        rowHeaders: true,
        rowHeights: 30,
        filters: false,
        dropdownMenu: false,
        stretchH: "all",
        licenseKey: '00000-00000-00000-00000-00000',
        manualColumnResize: true,
        manualRowResize: true,
        persistentState: true,
        cells: function (row, col) { const cellProperties = {}; cellProperties.className = 'htMiddle'; return cellProperties; },
        contextMenu: false,
    });
    $("#baslat").click(function() {calisanexcelduzenletamam(excel);});
}
function calisanexcelduzenletamam(excel)
{
    const tableData = excel.getData();
    const excelveri = tableData.map(r=>({ad:adsoyadstring(r[0]),un:basharfstring(r[1])})).filter(r=>r.ad.trim()!=="");
    if (excelveri.length === 0)
    {
        alertify.error("En az bir çalışan yazınız");
        return false;
    }
    let mysqljson = $('#HiddenField1').val();
    mysqljson = mysqljson ? JSON.parse(mysqljson) : [];
    const sonjson = [];
    excelveri.forEach(e=>{const m=mysqljson.find(x=>x.ad===e.ad);if(!m){sonjson.push({ad:e.ad,un:e.un,sonuc:1});}});//EKLE
    mysqljson.forEach(m=>{const e=excelveri.find(x=>x.ad===m.ad);if(e){sonjson.push({ad:e.ad,un:e.un,a:m.a,t:m.t,r:m.r,e:m.e,s:m.s,i:m.i,id:m.id,sonuc:2});}else{sonjson.push({ad:m.ad,un:m.un,id:m.id,sonuc:0});}});//DÜZENLE SİL
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
