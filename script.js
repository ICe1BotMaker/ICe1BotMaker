lucide.createIcons();

function toggleSection(sectionId, defaultOpen = false) {
    const content = document.getElementById(`${sectionId}-content`);
    const chevron = document.getElementById(`${sectionId}-chevron`);
    const title = document.getElementById(`${sectionId}-title`);

    if (defaultOpen && !content.classList.contains("open")) {
        content.classList.add("open");
        chevron.classList.add("rotate");
        if (chevron) {
            chevron.classList.remove("stroke-gray-400");
            chevron.classList.add("stroke-gray-600");
        }
        if (title) {
            title.classList.remove("text-[14px]", "font-medium");
            title.classList.add("text-[16px]", "font-bold");
        }
        return;
    }

    const isOpen = content.classList.contains("open");

    if (isOpen) {
        content.classList.remove("open");
        chevron.classList.remove("rotate");
        if (chevron) {
            chevron.classList.remove("stroke-gray-600");
            chevron.classList.add("stroke-gray-400");
        }
        if (title) {
            title.classList.remove("text-[16px]", "font-bold");
            title.classList.add("text-[14px]", "font-medium");
        }
    } else {
        content.classList.add("open");
        chevron.classList.add("rotate");
        if (chevron) {
            chevron.classList.remove("stroke-gray-400");
            chevron.classList.add("stroke-gray-600");
        }
        if (title) {
            title.classList.remove("text-[14px]", "font-medium");
            title.classList.add("text-[16px]", "font-bold");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    toggleSection("education", true);
});

function convertToPdf() {
    const container = document.getElementById("container");
    const option = {
        filename: "고서온_이력서.pdf",
        image: { type: "jpeg", quality: 0.98 },
        pagebreak: { mode: "avoid-all" },
    };

    html2pdf().set(option).from(container).save();
}
