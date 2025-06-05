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
