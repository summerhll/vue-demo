<script>
export default {
    name: 'jupiter-table',
    data() {
        return {
           
        };
    },
    props: {
        fixed: {
            default() {
                return false;
            },
            type: Boolean
        },
        data: {
            default() {
                return [];
            },
            type: Array
        }
    },
    methods: {
        renderFixedHeader(c, headers = []) {
            if (this.showFixedHeader) {
                return c('div', { class: 'fixed-header' }, [
                    c('table', {}, headers.map(h => {
                        return c('tr', {}, [c('td', { class: 'data-header' }, Array.isArray(h.value) ? h.value : [h.value])]);
                    }))
                ]);
            } else {
                return null;
            }
        }
    },
    computed: {
        showFixedHeader() {
            return this.fixed;
        }
    },
    render(c) {
        const tableRowNodes = ((this.$slots && this.$slots.default) || [])
                            .filter(vnode => {
                                return (!vnode.componentOptions.propsData.hideCommonRow || !vnode.componentOptions.propsData.isSame)
                                && vnode.componentOptions.tag === 'jupiter-table-row';
                            });
        const headers = tableRowNodes
                            .map(vnode => {
                                return {
                                    key: vnode.componentOptions.propsData.field,
                                    value: (!Array.isArray(vnode.componentOptions.children) || !vnode.componentOptions.children.length) ? 
                                        vnode.componentOptions.propsData.label : 
                                        vnode.componentOptions.children
                                }
                            });
        const fixedHeaderNode = this.renderFixedHeader(c, headers);

        return c('div', { class: 'jupiter-horizontal-table' }, [
            c('div', { class: 'table-wrap' }, [
                c('table', { ref: 'bjTable' }, [
                    c('tbody', {}, tableRowNodes.map(node => {
                        return {
                            ...node,
                            componentOptions: {
                                ...node.componentOptions,
                                propsData: {
                                    ...node.componentOptions.propsData,
                                    data: this.data
                                }
                            }
                        }
                    }))
                ])
            ]),
            fixedHeaderNode
        ])
    },
    
}
</script>

<style lang="less">
@header-cell-width: 95px;
@data-cell-width: 120px;
@cell-height: 48px;
.jupiter-horizontal-table {
    box-sizing: border-box;
    position: relative;
    font-size: 13px;
    overflow: hidden;
    background: #fff;

    table {
        table-layout: fixed;
        border-spacing: 0;
        border-collapse: collapse;
    }

    .table-wrap {
        overflow-x: auto;
    }

    .fixed-header {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        background: #fff;
       

        td {
            width: calc(@header-cell-width);
            min-width: calc(@header-cell-width);
            max-width: calc(@header-cell-width);
            height: @cell-height;
        }
    }

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
</style>
