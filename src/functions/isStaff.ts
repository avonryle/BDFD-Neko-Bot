import { GuildMember } from "discord.js";
import StaffRoles from "../util/constants/StaffRoles";

export default function(member: GuildMember): boolean {
    return Object.values(StaffRoles).some(c => member.roles.cache.has(c))
}