import { GuildMember } from "discord.js";
import StaffRoles from "../util/constants/StaffRoles";

export default function(member: GuildMember) {
    return [
        StaffRoles.ADMIN_TEST,
        StaffRoles.LEAD_STAFF,
        StaffRoles.MODERATOR
    ].some(c => member.roles.cache.has(c))
}