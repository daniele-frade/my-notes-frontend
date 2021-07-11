import { Component } from "react"
import { Link } from 'react-router-dom'
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent, SidebarFooter } from 'react-pro-sidebar';
import { BsPlusCircleFill } from 'react-icons/bs'
import { CgNotes } from 'react-icons/cg'


class Sidebar extends Component {
    
    render() {
        return (
            <ProSidebar>
                <SidebarHeader>
                <Link to="/" className="logo">
                    My Notes <CgNotes />
                </Link>
                </SidebarHeader>
                <SidebarContent>
                    <Menu>
                        <MenuItem icon={<BsPlusCircleFill size="1.85rem" />}>New Note
                        <Link to="/new-note" />
                        </MenuItem>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <div className="footer">
                        Copyright 2021
                    </div>
                </SidebarFooter>
            </ProSidebar>
        )
    }
}

export default Sidebar