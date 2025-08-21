<script lang="ts">
    interface Props {
        color?: string;
        size?: 'small' | 'medium' | 'large';
        children: any;
    }

    let { children, color = '#3b82f6', size = 'medium' }: Props = $props();

    let textColor = $derived(backgroundColorToTextColor(color));
    let sizeClass = $derived(`label-${size}`);

    function backgroundColorToTextColor(colorCode: string): string {
        let colorWithoutHash = colorCode.slice(1);
        let r = Number("0x" + colorWithoutHash.substring(0, 2));
        let g = Number("0x" + colorWithoutHash.substring(2, 4));
        let b = Number("0x" + colorWithoutHash.substring(4, 6));

        // Improved contrast calculation using WCAG guidelines
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? "#000000" : "#ffffff";
    }
</script>

<span 
    class="label {sizeClass}" 
    style="background-color: {color}; color: {textColor};"
>
    {@render children?.()}
</span>

<style>
    .label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        text-decoration: none;
        font-weight: 500;
        cursor: default;
        text-align: center;
        border: none;
        font-family: inherit;
        line-height: 1.2;
        white-space: nowrap;
        transition: all 0.2s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .label:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }

    .label-small {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        border-radius: 12px;
    }

    .label-medium {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        border-radius: 12px;        
    }

    .label-large {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 20px;
    }

    @media (max-width: 768px) {
        .label-medium {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
        }

        .label-large {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
        }

        .label-small {
            padding: 0.2rem 0.4rem;
            font-size: 0.7rem;
        }
    }

    @media (max-width: 640px) {
        .label-medium {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
        }

        .label-large {
            padding: 0.35rem 0.7rem;
            font-size: 0.85rem;
        }

        .label-small {
            padding: 0.2rem 0.4rem;
            font-size: 0.65rem;
        }
    }

    @media (max-width: 480px) {
        .label {
            white-space: normal;
            word-break: break-word;
            max-width: 150px;
        }

        .label-medium {
            padding: 0.25rem 0.5rem;
            font-size: 0.7rem;
            line-height: 1.3;
        }

        .label-large {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
            line-height: 1.3;
        }

        .label-small {
            padding: 0.2rem 0.4rem;
            font-size: 0.6rem;
            line-height: 1.3;
        }
    }
</style>
