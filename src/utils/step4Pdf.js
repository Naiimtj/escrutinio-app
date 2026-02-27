import jsPDF from 'jspdf';
import { getElectionTypeLabel } from '../constants/electionTypes';

const sanitizeFileToken = (str) => {
  if (!str) return '';
  return str.replaceAll(/[/\\?%*:|"<>]/g, '-').trim();
};

const getFormattedDate = (date) => {
  if (date) {
    const dateParts = date.split('-');
    if (dateParts.length === 3) {
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    return date.replaceAll('/', '-');
  }

  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

export const generateStep4Pdf = ({
  t,
  config,
  stats,
  results,
  comments,
  tiebreakerDelegates,
  voters = [],
  tiebreakerData = null,
}) => {
  // Build a lookup map: fullName → voter object (for splitting name parts)
  const voterByFullName = {};
  voters.forEach((v) => {
    const full = `${v.name} ${v.lastName1} ${v.lastName2}`.trim();
    voterByFullName[full] = v;
  });
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let y = 20;

  const checkPageBreak = (needed = 20) => {
    if (y > pageHeight - needed) {
      pdf.addPage();
      y = 20;
      return true;
    }
    return false;
  };

  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  const mainTitle = t('step4.pdf.documentTitle');
  pdf.text(mainTitle, pageWidth / 2, y, { align: 'center' });
  const mainTitleWidth = pdf.getTextWidth(mainTitle);
  pdf.setDrawColor(0, 0, 0);
  pdf.line(
    pageWidth / 2 - mainTitleWidth / 2,
    y + 1.5,
    pageWidth / 2 + mainTitleWidth / 2,
    y + 1.5,
  );
  y += 9;

  // ── Electoral area (centered) ──
  pdf.setFontSize(13);
  pdf.setFont(undefined, 'bold');
  pdf.text(
    `${t('step4.pdf.electoralAreaPrefix')} ${config?.electoral_area ?? ''}`,
    pageWidth / 2,
    y,
    { align: 'center' },
  );
  y += 10;

  // ── Election date (right-aligned) ──
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');
  pdf.text(
    `${t('step4.pdf.electionDateLabel')}: ${config?.election_date ?? ''}`,
    pageWidth - 15,
    y,
    { align: 'right' },
  );
  y += 12;

  // ── Numbered statistics list ──
  const INDENT1 = 15; // main items
  const INDENT2 = 25; // sub-items a, b
  const VAL_X = 165; // fixed tab-stop for values
  const LINE_H = 7;

  const drawStatItem = ({
    num,
    label,
    value = null,
    bold = false,
    indent = INDENT1,
  }) => {
    checkPageBreak();
    pdf.setFontSize(11);
    pdf.setFont(undefined, bold ? 'bold' : 'normal');
    pdf.text(`${num} ${label}:`, indent, y);
    if (value !== null && value !== undefined && value !== '') {
      pdf.setFont(undefined, 'normal');
      pdf.text(String(value), VAL_X, y);
    }
    y += LINE_H;
  };

  drawStatItem({
    num: '1.',
    label: t('step4.pdf.stat1'),
    value: stats.totalVoters,
    bold: true,
  });
  drawStatItem({
    num: 'a.',
    label: t('step4.pdf.stat1a'),
    value: config?.ballots_person ?? 0,
    indent: INDENT2,
  });
  drawStatItem({
    num: 'b.',
    label: t('step4.pdf.stat1b'),
    value: config?.ballots_postal ?? 0,
    indent: INDENT2,
  });
  drawStatItem({
    num: '2.',
    label: t('step4.pdf.stat2'),
    value: stats.totalBallots,
    bold: true,
  });
  drawStatItem({
    num: '3.',
    label: t('step4.pdf.stat3'),
    value: stats.delegates,
  });
  drawStatItem({
    num: '4.',
    label: t('step4.pdf.stat4'),
    value: stats.invalidNames,
  });
  drawStatItem({
    num: '5.',
    label: t('step4.pdf.stat5'),
    value: stats.nullBallots,
  });

  y += 6;

  const commentsText = comments.trim();
  if (commentsText) {
    checkPageBreak(30);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(t('step4.comments.title'), 20, y);
    y += 8;

    const commentLines = pdf.splitTextToSize(commentsText, pageWidth - 40);
    commentLines.forEach((line) => {
      checkPageBreak(10);
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.text(line, 20, y);
      y += 6;
    });

    y += 6;
  }

  checkPageBreak(40);

  // ── Section title: DELEGADOS ELEGIDOS (uppercase + underlined, centered) ──
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  const delegadosTitle = t('step4.pdf.electedDelegates').toUpperCase();
  pdf.text(delegadosTitle, pageWidth / 2, y, { align: 'center' });
  const titleWidth = pdf.getTextWidth(delegadosTitle);
  pdf.setDrawColor(0, 0, 0);
  pdf.line(
    pageWidth / 2 - titleWidth / 2,
    y + 1.5,
    pageWidth / 2 + titleWidth / 2,
    y + 1.5,
  );
  y += 12;

  // ── 3-column table layout (x positions) ──
  // Votes column spans from ~159 to 195mm (right margin 15mm) → center = 177
  const COL = {
    nombre: 15,
    ap1: 72,
    ap2: 130,
    votosCenter: 177,
    votosStart: 159,
  };
  const ROW_H = 7;

  const drawWinnersTableHeader = () => {
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(80, 80, 80);
    pdf.text(t('step4.pdf.colNombre'), COL.nombre, y);
    pdf.text(t('step4.pdf.colAp1'), COL.ap1, y);
    pdf.text(t('step4.pdf.colAp2'), COL.ap2, y);
    pdf.text(t('step4.pdf.colVotos'), COL.votosCenter, y, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
    y += 1.5;
    pdf.setDrawColor(150, 150, 150);
    pdf.line(COL.nombre, y, pageWidth - 15, y);
    y += ROW_H - 1;
    pdf.setFont(undefined, 'normal');
  };

  // Build winner rows depending on tiebreaker state
  const hasTiebreakerResult =
    tiebreakerDelegates && tiebreakerDelegates.length > 0;

  let winnerRows;
  if (hasTiebreakerResult) {
    const votesMap = {};
    results.forEach((r) => {
      votesMap[r.name] = r.votes;
    });
    winnerRows = [...tiebreakerDelegates]
      .sort((a, b) => a.position - b.position)
      .map((d) => ({
        name: d.name,
        votes: votesMap[d.name] ?? 0,
        byTiebreaker: d.byTiebreaker,
      }));
  } else if (stats.hasTie) {
    winnerRows = results.filter(
      (r) => stats.cutoffVotes !== null && r.votes > stats.cutoffVotes,
    );
  } else {
    winnerRows = results.slice(0, stats.delegates);
  }

  if (stats.hasTie && !hasTiebreakerResult) {
    checkPageBreak(18);
    pdf.setFillColor(255, 243, 205);
    pdf.rect(15, y - 5, pageWidth - 30, 12, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(180, 83, 9);
    pdf.text(t('step4.tieWarning'), 20, y);
    pdf.setTextColor(0, 0, 0);
    y += 12;
  }

  drawWinnersTableHeader();

  winnerRows.forEach((result) => {
    if (checkPageBreak(ROW_H + 5)) {
      drawWinnersTableHeader();
    }

    const voter = voterByFullName[result.name];
    const firstName = voter?.name ?? result.name;
    const lastName1 = voter?.lastName1 ?? '';
    const lastName2 = voter?.lastName2 ?? '';

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);

    pdf.text(
      pdf.splitTextToSize(firstName, COL.ap1 - COL.nombre - 3)[0],
      COL.nombre,
      y,
    );
    pdf.text(
      pdf.splitTextToSize(lastName1, COL.ap2 - COL.ap1 - 3)[0],
      COL.ap1,
      y,
    );
    pdf.text(
      pdf.splitTextToSize(lastName2, COL.votosStart - COL.ap2 - 3)[0],
      COL.ap2,
      y,
    );
    pdf.text(String(result.votes), COL.votosCenter, y, { align: 'center' });

    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);

    y += ROW_H;
  });

  // ── Scrutineers section ──
  y += 10;
  checkPageBreak(20);
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.text(`${t('step4.pdf.scrutineersLabel')}:`, 15, y);
  y += 7;
  pdf.setFont(undefined, 'normal');
  if (config?.scrutineersNames && config.scrutineersNames.length > 0) {
    config.scrutineersNames.forEach((name) => {
      checkPageBreak(8);
      pdf.text(name, 25, y);
      y += 6;
    });
  }
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(8);
  pdf.text(
    `${t('step4.generatedLabel')}: ${new Date().toLocaleString()}`,
    20,
    pageHeight - 10,
  );

  // =========================================================================
  // HELPER: render full first-round results table (all candidates)
  // =========================================================================
  const renderAllResultsPage = () => {
    if (results.length === 0) return;
    pdf.addPage();
    y = 20;

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    const allResTitle = t('step4.pdf.allResultsPageTitle').toUpperCase();
    pdf.text(allResTitle, pageWidth / 2, y, { align: 'center' });
    const arW = pdf.getTextWidth(allResTitle);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(
      pageWidth / 2 - arW / 2,
      y + 1.5,
      pageWidth / 2 + arW / 2,
      y + 1.5,
    );
    y += 12;

    const MARGIN = 15;
    const COL_NUM = MARGIN;
    const COL_NAME = 28;
    const COL_VOTES = 160;

    const hasTiebreakerResult =
      tiebreakerDelegates && tiebreakerDelegates.length > 0;
    const tbSet = new Set((tiebreakerDelegates ?? []).map((d) => d.name));

    const drawAllResultsHeader = () => {
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text('#', COL_NUM, y);
      pdf.text(t('step4.name'), COL_NAME, y);
      pdf.text(t('step4.pdf.colVotos'), COL_VOTES, y, { align: 'right' });
      pdf.setTextColor(0, 0, 0);
      y += 2;
      pdf.setDrawColor(150, 150, 150);
      pdf.line(MARGIN, y, pageWidth - MARGIN, y);
      y += 6;
      pdf.setFont(undefined, 'normal');
    };

    drawAllResultsHeader();

    results.forEach((result, index) => {
      if (y > pageHeight - 15) {
        pdf.addPage();
        y = 20;
        drawAllResultsHeader();
      }

      const isElected = hasTiebreakerResult
        ? tbSet.has(result.name)
        : index < stats.delegates;

      const isTied =
        !hasTiebreakerResult &&
        stats.hasTie &&
        stats.cutoffVotes !== null &&
        result.votes === stats.cutoffVotes;

      pdf.setFontSize(10);
      if (isElected) {
        pdf.setTextColor(21, 128, 61);
        pdf.setFont(undefined, 'bold');
      } else if (isTied) {
        pdf.setTextColor(180, 83, 9);
        pdf.setFont(undefined, 'bold');
      } else {
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'normal');
      }

      const numLabel = String(index + 1);
      pdf.text(numLabel, COL_NUM, y);
      const maxNameW = COL_VOTES - COL_NAME - 8;
      pdf.text(pdf.splitTextToSize(result.name, maxNameW)[0], COL_NAME, y);
      pdf.text(String(result.votes), COL_VOTES, y, { align: 'right' });

      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'normal');
      y += 6.5;
    });
  };

  // =========================================================================
  // HELPER: render a ballot table (used for main ballots + tiebreaker rounds)
  // =========================================================================
  const personLabel = (person) => {
    if (!person) return '';
    if (person.isInvalid) return person.name ?? '';
    return `${person.name ?? ''} ${person.lastName1 ?? ''} ${person.lastName2 ?? ''}`.trim();
  };

  const renderBallotsPage = ({
    pageTitle,
    ballotsToRender,
    votesPerBallot,
    roundResults = null,
  }) => {
    pdf.addPage();
    y = 20;

    // Page title (centered, bold, underlined)
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(pageTitle, pageWidth / 2, y, { align: 'center' });
    const ptWidth = pdf.getTextWidth(pageTitle);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(
      pageWidth / 2 - ptWidth / 2,
      y + 1.5,
      pageWidth / 2 + ptWidth / 2,
      y + 1.5,
    );
    y += 12;

    // Compute column widths
    const MARGIN = 15;
    const NUM_W = 12;
    const usable = pageWidth - MARGIN * 2 - NUM_W;
    const voteColW = Math.floor(usable / votesPerBallot);
    const voteColX = (i) => MARGIN + NUM_W + voteColW * i;

    // Table header
    const drawBallotHeader = () => {
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text('Nº', MARGIN, y);
      for (let i = 0; i < votesPerBallot; i++) {
        pdf.text(`${t('step4.pdf.vote')} ${i + 1}`, voteColX(i), y);
      }
      pdf.setTextColor(0, 0, 0);
      y += 2;
      pdf.setDrawColor(150, 150, 150);
      pdf.line(MARGIN, y, pageWidth - MARGIN, y);
      y += 5;
      pdf.setFont(undefined, 'normal');
    };

    if (ballotsToRender.length > 0) drawBallotHeader();

    ballotsToRender.forEach((ballot) => {
      if (y > pageHeight - 15) {
        pdf.addPage();
        y = 20;
        drawBallotHeader();
      }
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(0, 0, 0);

      if (ballot.isNull) {
        pdf.setTextColor(180, 0, 0);
        pdf.text(String(ballot.number), MARGIN, y);
        pdf.text(t('step4.pdf.nullBallotLabel'), voteColX(0), y);
        pdf.setTextColor(0, 0, 0);
      } else {
        pdf.text(String(ballot.number), MARGIN, y);
        const votes = ballot.votes ?? [];
        for (let i = 0; i < votesPerBallot; i++) {
          const vote = votes[i];
          if (vote?.person) {
            const maxW = voteColW - 3;
            const label = personLabel(vote.person);
            pdf.text(pdf.splitTextToSize(label, maxW)[0], voteColX(i), y);
          }
        }
      }
      y += 5.5;
    });

    // Round results table (for tiebreaker rounds)
    if (roundResults) {
      y += 6;
      if (y > pageHeight - 40) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      const resTitle = t('step4.pdf.roundResultsTitle').toUpperCase();
      pdf.text(resTitle, pageWidth / 2, y, { align: 'center' });
      const rtW = pdf.getTextWidth(resTitle);
      pdf.setDrawColor(0, 0, 0);
      pdf.line(
        pageWidth / 2 - rtW / 2,
        y + 1.5,
        pageWidth / 2 + rtW / 2,
        y + 1.5,
      );
      y += 10;

      const RES_NAME_X = 20;
      const RES_VOTES_X = 130;
      const RES_STATUS_X = 155;

      pdf.setFontSize(9);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text(t('step4.pdf.colNombre'), RES_NAME_X, y);
      pdf.text(t('step4.pdf.colVotos'), RES_VOTES_X, y, { align: 'center' });
      pdf.text(t('step4.pdf.roundResultStatus'), RES_STATUS_X, y);
      pdf.setTextColor(0, 0, 0);
      y += 2;
      pdf.setDrawColor(150, 150, 150);
      pdf.line(RES_NAME_X, y, pageWidth - 15, y);
      y += 6;
      pdf.setFont(undefined, 'normal');

      roundResults.results.forEach((r) => {
        if (y > pageHeight - 15) {
          pdf.addPage();
          y = 20;
        }
        const isWinner = (roundResults.clearWinners ?? []).includes(r.name);
        const isTied = (roundResults.stillTied ?? []).includes(r.name);
        pdf.setFontSize(9);
        if (isWinner) {
          pdf.setTextColor(21, 128, 61);
          pdf.setFont(undefined, 'bold');
        } else if (isTied) {
          pdf.setTextColor(180, 83, 9);
          pdf.setFont(undefined, 'bold');
        } else {
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, 'normal');
        }
        pdf.text(
          pdf.splitTextToSize(r.name, RES_VOTES_X - RES_NAME_X - 3)[0],
          RES_NAME_X,
          y,
        );
        pdf.text(String(r.votes), RES_VOTES_X, y, { align: 'center' });
        const statusLabel = isWinner
          ? t('step4.tiebreaker.elected')
          : isTied
            ? t('step4.tiebreaker.stillTied')
            : '';
        if (statusLabel) pdf.text(statusLabel, RES_STATUS_X, y);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'normal');
        y += 6;
      });
    }
  };

  // ── Full first-round results page ──
  renderAllResultsPage();

  // ── Tiebreaker round pages (results only, no ballot listing) ──
  const tbRounds = tiebreakerData?.rounds ?? [];
  tbRounds.forEach((round) => {
    renderBallotsPage({
      pageTitle: `${t('step4.tiebreaker.round').toUpperCase()} ${round.roundNumber} – ${t('step4.pdf.tiebreakerPageTitle').toUpperCase()}`,
      ballotsToRender: [],
      votesPerBallot: round.winnersNeeded || 1,
      roundResults: round,
    });
  });

  const resultText = t('step4.results');
  const area = sanitizeFileToken(
    config?.electoral_area || t('step4.pdfFilename.defaultArea'),
  );
  const type = sanitizeFileToken(
    getElectionTypeLabel(config?.election_type, t) ||
      t('step4.pdfFilename.defaultType'),
  );
  const formattedDate = getFormattedDate(config?.election_date);

  const filename = `${resultText}-${area}-${type}-${formattedDate}.pdf`;
  pdf.save(filename);
};
