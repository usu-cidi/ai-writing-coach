import {
    View,
    TopNavBar,
    Text,
    IconAnnotateSolid,
} from "@instructure/ui";
// let isInitial = true;
function ToolNavBar(props) {
    return (
        <>
            <TopNavBar>
                {() => (
                    <TopNavBar.Layout
                        navLabel="Example navigation bar"
                        desktopConfig={{
                            hideActionsUserSeparator: false,
                        }}
                        smallViewportConfig={{
                            dropdownMenuToggleButtonLabel: "Toggle Menu",
                            dropdownMenuLabel: "Main Menu",
                        }}
                        renderBrand={
                            <TopNavBar.Brand
                                screenReaderLabel="Brand name"
                                renderName={
                                    <View as="div" minWidth="14.6rem">
                                        <Text
                                            as="div"
                                            color="primary-inverse"
                                            transform="uppercase"
                                            size="small"
                                            weight="bold"
                                            lineHeight="condensed"
                                        >
                                            Writing
                                        </Text>
                                        <Text
                                            as="div"
                                            color="primary-inverse"
                                            size="large"
                                            weight="normal"
                                            lineHeight="condensed"
                                        >
                                            Coach
                                        </Text>
                                    </View>
                                }
                                nameBackground="#2D3B45"
                                href="https://elearn.usu.edu/ludovic/writing-coach/public/build/"
                            />
                        }
                        renderActionItems={
                            <TopNavBar.ActionItems
                                listLabel="Actions"
                                renderHiddenItemsMenuTriggerLabel={(hiddenChildrenCount) =>
                                    `${hiddenChildrenCount} more actions`
                                }
                            >
                                <TopNavBar.Item
                                    id="WritingCoach"
                                    renderIcon={<IconAnnotateSolid />}
                                    href="https://elearn.usu.edu/ludovic/writing-coach/public/build/"
                                >
                                    Home
                                </TopNavBar.Item>
                            </TopNavBar.ActionItems>
                        }
                    />
                )}
            </TopNavBar>
        </>
    );
}
export default ToolNavBar;
