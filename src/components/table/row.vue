<template>
    <tr 
        v-if="!hideCommonRow || !areSame()"
        class="jupiter-table-row"
        :class="{ 'highlight': highlightDiffs && !areSame() }">
        <td
            class="data-header custom-header"
            :style="{ height }">
            <slot name="title-widget">
                <span>{{ label }}</span>
            </slot>
        </td>
        <td
            class="data-cell custom-cell"
            :style="{ height }"
            :key="item.id"
            v-for="item in data">
            <slot v-bind:prop="field" v-bind:item="item">
                <span>{{ item[field] }}</span>
            </slot>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'table-row',
    props: {
        field: {
            default() {
                return '';
            },
            type: String
        },
        label: {
            default() {
                return '';
            },
            type: String
        },
        height: {
            default() {
               // return '.96rem';
                  return '48px';
            },
            type: String
        },
        data: {
            default() {
                return [];
            },
            type: Array
        },
        hideCommonRow: {
            default() {
                return false;
            },
            type: Boolean
        },
          isSame: {
            default() {
                return false;
            },
            type: Boolean
        },
        highlightDiffs: {
            default() {
                return true;
            },
            type: Boolean
        }
    },
    methods: {
        areSame() {
            const items = this.data.map(d => d[this.field]);
            let bRet = true;

            for(let i = 1; i < items.length; i++) {
                if (items[i] !== items[0]) {
                    bRet = false;
                    break;
                }
            }

            return bRet;
        }
    }
}
</script>

<style lang="less">
//@header-cell-width: 1.9rem;
//@data-cell-width: 2.56rem;
//@cell-height: .96rem;
@header-cell-width: 95px;
@data-cell-width: 128px;
@cell-height: 48px;

.jupiter-table-row {

    .data-header {
        text-align: center;
        vertical-align: middle;
        background: #fff;
        width: @header-cell-width;
        min-width: @header-cell-width;
        max-width: @header-cell-width;
        height: @cell-height;
        margin: 0;
        padding: 0;
        color: #8D8E99;
    }

    .data-cell {
        text-align: left;
        vertical-align: middle;
        width: @data-cell-width;
        min-width: @data-cell-width;
        max-width: @data-cell-width;
        height: @cell-height;
        margin: 0;
        padding: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.highlight {
    background: #FDF4F5;
}
</style>


